interface SwipeOptions {
  isEnabled: () => boolean;
  getScale: () => number;
  previous: () => void;
  next: () => void;
}

interface Gesture {
  id: number;
  x: number;
  y: number;
  captureTarget: Element;
}

interface ReleasedSwipe {
  id: number;
  time: number;
  x: number;
  y: number;
}

export const bindLightboxSwipe = (stage: HTMLElement, options: SwipeOptions) => {
  const document = stage.ownerDocument;
  const capture = { capture: true };
  const touches = new Set<number>();
  let gesture: Gesture | null = null;
  let released: ReleasedSwipe | null = null;
  const enabled = (): boolean => options.isEnabled() && options.getScale() <= 1.01;

  const releaseCapture = (target: Element, id: number): void => {
    try {
      if (target.hasPointerCapture(id)) target.releasePointerCapture(id);
    } catch {
      // The browser may already have discarded a canceled pointer.
    }
  };

  const cancelGesture = (): void => {
    const current = gesture;
    gesture = null;
    if (current) releaseCapture(current.captureTarget, current.id);
  };

  const reset = (): void => {
    cancelGesture();
    touches.clear();
    released = null;
  };

  const down = (event: PointerEvent): void => {
    released = null;
    if (event.pointerType !== "touch" || !options.isEnabled()) return;
    touches.add(event.pointerId);
    if (touches.size !== 1) {
      cancelGesture();
      return;
    }
    if (!enabled() || !event.isPrimary || !event.composedPath().includes(stage)) {
      return;
    }
    // Capture the original element so an image tap is not retargeted to stage whitespace.
    const captureTarget = event.composedPath().find(
      (target): target is Element => "setPointerCapture" in target,
    ) ?? stage;
    gesture = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      captureTarget,
    };
    try {
      captureTarget.setPointerCapture(event.pointerId);
    } catch {
      // A pointer that ended before capture cannot start a reliable gesture.
      gesture = null;
    }
  };

  const move = (event: PointerEvent): void => {
    if (gesture?.id !== event.pointerId) return;
    const dx = Math.abs(event.clientX - gesture.x);
    const dy = Math.abs(event.clientY - gesture.y);
    if (!enabled() || (dy > 10 && dy >= dx)) cancelGesture();
  };

  const up = (event: PointerEvent): void => {
    const start = gesture;
    const singleTouch = touches.size === 1;
    touches.delete(event.pointerId);
    if (start?.id !== event.pointerId) return;
    cancelGesture();
    const dx = event.clientX - start.x;
    const dy = Math.abs(event.clientY - start.y);
    if (
      !singleTouch || !enabled() ||
      Math.abs(dx) < 48 || Math.abs(dx) < dy * 1.5
    ) return;
    released = {
      id: event.pointerId,
      time: event.timeStamp,
      x: event.clientX,
      y: event.clientY,
    };
    if (dx < 0) options.next();
    else options.previous();
  };

  const cancel = (event: PointerEvent): void => {
    touches.delete(event.pointerId);
    if (gesture?.id === event.pointerId) cancelGesture();
  };

  const lostCapture = (event: PointerEvent): void => {
    if (gesture?.id === event.pointerId) gesture = null;
  };

  const click = (event: MouseEvent): void => {
    const swipe = released;
    released = null;
    if (!swipe || event.detail === 0 || event.timeStamp - swipe.time > 700) return;
    // Modern click events carry pointer identity; older engines need endpoint matching.
    const matches = "pointerId" in event
      ? event.pointerId === swipe.id
      : Math.hypot(event.clientX - swipe.x, event.clientY - swipe.y) <= 25;
    if (matches) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  document.addEventListener("pointerdown", down, capture);
  document.addEventListener("pointermove", move, capture);
  document.addEventListener("pointerup", up, capture);
  document.addEventListener("pointercancel", cancel, capture);
  stage.addEventListener("lostpointercapture", lostCapture);
  stage.addEventListener("click", click, capture);

  return {
    reset,
    destroy: (): void => {
      reset();
      document.removeEventListener("pointerdown", down, capture);
      document.removeEventListener("pointermove", move, capture);
      document.removeEventListener("pointerup", up, capture);
      document.removeEventListener("pointercancel", cancel, capture);
      stage.removeEventListener("lostpointercapture", lostCapture);
      stage.removeEventListener("click", click, capture);
    },
  };
};
