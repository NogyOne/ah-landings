import assert from "node:assert/strict";
import test from "node:test";
import { bindLightboxSwipe } from "../src/scripts/lightbox-swipe.ts";

// Native EventTarget exercises the production listener/state boundary, not browser gestures.
function harness() {
  const document = new EventTarget();
  const stage = new EventTarget();
  const captures = new Set();
  stage.ownerDocument = document;
  stage.setPointerCapture = (id) => captures.add(id);
  stage.hasPointerCapture = (id) => captures.has(id);
  stage.releasePointerCapture = (id) => {
    captures.delete(id);
    emit(stage, "lostpointercapture", { pointerId: id });
  };
  let enabled = true;
  let scale = 1;
  const navigation = [];
  const binding = bindLightboxSwipe(stage, {
    isEnabled: () => enabled,
    getScale: () => scale,
    previous: () => navigation.push("previous"),
    next: () => navigation.push("next"),
  });
  const pointer = (type, overrides = {}) => emit(document, type, {
    pointerId: 1, pointerType: "touch", isPrimary: true,
    clientX: 150, clientY: 100, composedPath: () => [stage, document], ...overrides,
  });
  const swipe = (x = 50) => {
    pointer("pointerdown");
    pointer("pointermove", { clientX: x });
    pointer("pointerup", { clientX: x });
  };
  return { stage, captures, navigation, binding, pointer, swipe,
    enable: (value) => { enabled = value; }, zoom: (value) => { scale = value; } };
}

function emit(target, type, properties) {
  const event = new Event(type, { cancelable: true });
  for (const [key, value] of Object.entries(properties)) {
    Object.defineProperty(event, key, { value });
  }
  target.dispatchEvent(event);
  return event;
}

test("touch release navigates once in each direction and releases capture", () => {
  const h = harness();
  h.pointer("pointerdown");
  h.pointer("pointermove", { clientX: 40 });
  assert.deepEqual(h.navigation, []);
  assert.equal(h.captures.size, 1);
  h.pointer("pointerup", { clientX: 40 });
  h.pointer("pointerup", { clientX: 40 });
  h.swipe(250);
  assert.deepEqual(h.navigation, ["next", "previous"]);
  assert.equal(h.captures.size, 0);
});

test("short, diagonal and initially vertical gestures never navigate", () => {
  for (const endpoint of [{ clientX: 120 }, { clientX: 80, clientY: 160 }]) {
    const h = harness();
    h.pointer("pointerdown");
    h.pointer("pointerup", endpoint);
    assert.deepEqual(h.navigation, []);
  }
  const h = harness();
  h.pointer("pointerdown");
  h.pointer("pointermove", { clientY: 130 });
  h.pointer("pointerup", { clientX: 20 });
  assert.deepEqual(h.navigation, []);
});

test("mouse, pen, non-primary and starts outside stage are ignored", () => {
  for (const overrides of [
    { pointerType: "mouse" }, { pointerType: "pen" },
    { isPrimary: false }, { composedPath: () => [] },
  ]) {
    const h = harness();
    h.pointer("pointerdown", overrides);
    h.pointer("pointerup", { clientX: 20, ...overrides });
    assert.deepEqual(h.navigation, []);
  }
});

test("capture stays on the original image rather than retargeting taps to stage", () => {
  const h = harness();
  const imageCaptures = new Set();
  const image = {
    setPointerCapture: (id) => imageCaptures.add(id),
    hasPointerCapture: (id) => imageCaptures.has(id),
    releasePointerCapture: (id) => imageCaptures.delete(id),
  };
  h.pointer("pointerdown", { composedPath: () => [image, h.stage] });
  assert.equal(imageCaptures.size, 1);
  assert.equal(h.captures.size, 0);
  h.pointer("pointerup");
  assert.equal(imageCaptures.size, 0);
  assert.deepEqual(h.navigation, []);
});

test("second touch outside stage cancels until all fingers end", () => {
  const h = harness();
  h.pointer("pointerdown");
  h.pointer("pointerdown", { pointerId: 2, isPrimary: false, composedPath: () => [] });
  h.pointer("pointerup", { pointerId: 2 });
  h.pointer("pointerdown", { pointerId: 3, isPrimary: false });
  h.pointer("pointerup", { pointerId: 3 });
  h.pointer("pointerup", { clientX: 20 });
  assert.deepEqual(h.navigation, []);
  h.swipe();
  assert.deepEqual(h.navigation, ["next"]);
});

test("pointercancel, lost capture and capture failure cancel without navigation", () => {
  for (const interruption of ["pointercancel", "lostpointercapture", "capture-failure"]) {
    const h = harness();
    if (interruption === "capture-failure") h.stage.setPointerCapture = () => { throw Error("ended"); };
    h.pointer("pointerdown");
    if (interruption === "pointercancel") h.pointer("pointercancel");
    if (interruption === "lostpointercapture") h.stage.releasePointerCapture(1);
    h.pointer("pointerup", { clientX: 20 });
    assert.deepEqual(h.navigation, []);
    assert.equal(h.captures.size, 0);
  }
});

test("closed/closing or zoomed state blocks start and release", () => {
  for (const change of [(h) => h.enable(false), (h) => h.zoom(2)]) {
    const h = harness();
    h.pointer("pointerdown");
    change(h);
    h.pointer("pointerup", { clientX: 20 });
    h.swipe();
    assert.deepEqual(h.navigation, []);
  }
});

test("zoom interruption cannot resume navigation after scale returns to one", () => {
  const h = harness();
  h.pointer("pointerdown");
  h.zoom(2);
  h.pointer("pointermove", { clientX: 50 });
  h.zoom(1);
  h.pointer("pointerup", { clientX: 20 });
  assert.deepEqual(h.navigation, []);
});

test("only the matching trailing pointer click is consumed", () => {
  const h = harness();
  let clicks = 0;
  h.stage.addEventListener("click", () => clicks++);
  h.swipe();
  const trailing = emit(h.stage, "click", { pointerId: 1, detail: 1 });
  assert.equal(trailing.defaultPrevented, true);
  assert.equal(clicks, 0);
  h.pointer("pointerdown");
  h.pointer("pointerup");
  emit(h.stage, "click", { pointerId: 1, detail: 1 });
  assert.equal(clicks, 1);
});

test("keyboard, unrelated, expired and legacy endpoint clicks are distinguished", () => {
  for (const properties of [
    { pointerId: 1, detail: 0 }, { pointerId: 9, detail: 1 },
    { pointerId: 1, detail: 1, timeStamp: 10000 }, { detail: 1, clientX: 300, clientY: 300 },
  ]) {
    const h = harness();
    h.swipe();
    assert.equal(emit(h.stage, "click", properties).defaultPrevented, false);
  }
  const h = harness();
  h.swipe();
  assert.equal(emit(h.stage, "click", { detail: 1, clientX: 50, clientY: 100 }).defaultPrevented, true);
});

test("reset releases capture and clears pending gestures and click suppression", () => {
  const h = harness();
  h.pointer("pointerdown");
  h.binding.reset();
  h.pointer("pointerup", { clientX: 20 });
  assert.deepEqual(h.navigation, []);
  assert.equal(h.captures.size, 0);
  h.swipe();
  h.binding.reset();
  assert.equal(emit(h.stage, "click", { pointerId: 1, detail: 1 }).defaultPrevented, false);
});

test("destroy removes every listener and remains safe when called twice", () => {
  const h = harness();
  h.pointer("pointerdown");
  h.binding.destroy();
  h.binding.destroy();
  h.swipe();
  emit(h.stage, "lostpointercapture", { pointerId: 1 });
  assert.equal(emit(h.stage, "click", { pointerId: 1, detail: 1 }).defaultPrevented, false);
  assert.deepEqual(h.navigation, []);
  assert.equal(h.captures.size, 0);
});
