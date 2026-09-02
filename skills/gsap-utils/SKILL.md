---
name: gsap-utils
description: "Trigger: gsap.utils, clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Apply GSAP utility helpers safely."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [halisco-landing]
  auto_invoke:
    - "Implementing or reviewing gsap.utils helpers in Halisco animation code"
    - "Mapping, clamping, snapping, randomizing, scoping, or normalizing GSAP values"
---

## Activation Contract

Load this skill when GSAP utility methods are used for numeric mapping, value normalization, random or stepped motion, target collections, or composed animation functions.

## Hard Rules

- Utilities are available on `gsap.utils`; they do not require plugin registration.
- Most value transforms accept the value last. Omit it to create a reusable function; for `random()`, pass `true` as the final argument instead.
- `mapRange()` and `normalize()` operate on numbers, not CSS units. Use `getUnit()` and `unitize()` when converting unit-bearing values.
- Use `gsap.utils.selector(scope)` or `toArray(value, scope)` to keep component selectors scoped and collections explicit.
- Prefer pure utility functions over duplicated math, and use a documented helper signature rather than relying on coercion.

## Decision Gates

| Need | Pattern |
| --- | --- |
| Bound a value | `clamp(min, max, value?)` |
| Convert ranges | `mapRange(inMin, inMax, outMin, outMax, value?)` or `normalize(min, max, value?)` |
| Interpolate values | `interpolate(start, end, progress?)` |
| Step or allowed values | `snap(incrementOrArray, value?)` |
| Random values | `random(min, max, snap?, true)` or `random(array, true)` |
| Reorder or distribute targets | `shuffle()` or `distribute(config)` |
| Scope or compose functions | `selector()`, `toArray()`, `pipe()`, `wrap()`, or `wrapYoyo()` |

## Execution Steps

1. Name the input domain, output domain, units, and whether the helper will be called once or repeatedly.
2. Use the direct form for one value and the function form for a stable configuration reused across events or targets.
3. Keep unit conversion separate from numeric mapping, and pass returned functions directly into function-based tween vars when appropriate.
4. Scope target collection to the owning component and avoid creating a new helper inside a hot loop.
5. Verify boundary values, negative values, empty collections, random behavior, and reduced-motion handling in the consuming animation.

```js
const progressToDegrees = gsap.utils.mapRange(0, 1, 0, 360);
const snapProgress = gsap.utils.snap(0.1);
const container = document.querySelector(".section");
const q = gsap.utils.selector(container);

gsap.to(q(".item"), {
  rotation: (index, target, targets) => progressToDegrees(snapProgress(index / Math.max(targets.length - 1, 1))),
  stagger: 0.05
});
```

## Output Contract

Return the helper choices, input/output domains and units, reusable-function decisions, target scope, edge cases checked, and verification performed.

## References

- `../../apps/halisco-landing/AGENTS.md` — Halisco static-rendering and client-runtime constraints.
