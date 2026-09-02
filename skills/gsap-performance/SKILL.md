---
name: gsap-performance
description: "Trigger: GSAP performance, jank, FPS, smooth animation, will-change, quickTo. Optimize transforms, batching, and animation cleanup for responsive Halisco interfaces."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [halisco-landing]
  auto_invoke:
    - "Optimizing Halisco GSAP animations for smooth rendering"
    - "Diagnosing animation jank, layout thrashing, or excessive active tweens"
---

## Activation Contract

Load this skill when optimizing GSAP animation cost, investigating jank or FPS, or reviewing performance-sensitive motion in Halisco.

## Hard Rules

- Animate `x`, `y`, `scale`, `rotation`, and opacity instead of `width`, `height`, `top`, `left`, margin, or padding when the visual result permits it.
- Use `will-change` only on elements that are about to animate; remove or avoid it for static elements and never apply it indiscriminately.
- Batch DOM reads before writes. Let GSAP own animation writes instead of interleaving layout reads with style changes in a loop.
- Use one stagger or reusable timeline for repeated motion. Do not create hundreds of overlapping tweens or a new timeline every frame.
- Clean up inactive, off-screen, or component-owned animations and ScrollTriggers so stale work cannot continue.

## Decision Gates

| Situation | Required action |
| --- | --- |
| Same motion across many elements | Use `stagger` or a shared timeline |
| High-frequency pointer or resize value | Use `gsap.quickTo()` instead of creating a tween per event |
| Long or off-screen list | Animate visible items only; consider virtualization |
| ScrollTrigger layout change | Refresh only after the change, and debounce custom refresh calls |
| Layer promotion considered | Prove the element animates before adding `will-change` |

## Execution Steps

1. Profile or identify the expensive property, target count, event frequency, or stale runtime.
2. Replace layout-heavy movement with transform aliases and reduce the number of concurrent properties.
3. Batch reads and writes, reuse timelines, and use `quickTo()` for continuously updated values.
4. Pause or kill work that is no longer visible or owned by a removed component.
5. Re-test on a low-end device or throttled profile and confirm visual quality, interaction, and cleanup.

```js
const xTo = gsap.quickTo(follower, "x", { duration: 0.25, ease: "power3.out" });
const yTo = gsap.quickTo(follower, "y", { duration: 0.25, ease: "power3.out" });
panel.addEventListener("pointermove", (event) => {
  xTo(event.clientX);
  yTo(event.clientY);
});
```

## Output Contract

Return the bottleneck, property or workload changed, concurrency and cleanup decisions, device/profile used, and remaining performance risks.

## References

- `../../apps/halisco-landing/AGENTS.md` — Halisco static-rendering and client-runtime constraints.
