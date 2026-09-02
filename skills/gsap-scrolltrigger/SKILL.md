---
name: gsap-scrolltrigger
description: "Trigger: ScrollTrigger, scroll animation, parallax, pinning, scrub. Build and review scroll-linked GSAP animations with correct registration, refresh, and cleanup."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [halisco-landing]
  auto_invoke:
    - "Implementing or reviewing scroll-linked GSAP animation in Halisco"
    - "Adding pinning, scrubbing, parallax, or scroll-triggered reveals"
---

## Activation Contract

Load this skill for GSAP `ScrollTrigger` work: scroll-linked tweens or timelines, pinning, scrubbing, parallax, trigger callbacks, and scroll cleanup.

## Hard Rules

- Register the plugin once before use: `gsap.registerPlugin(ScrollTrigger)`.
- Put `scrollTrigger` on a top-level tween or timeline, never on a child tween inside a timeline.
- Choose `scrub` for continuous scroll progress or `toggleActions` for discrete playback; do not combine them.
- Pin only what is needed. If the pinned element is animated, animate a child instead. Remove `markers: true` before production.
- Call `ScrollTrigger.refresh()` after dynamic content, images, fonts, or layout changes that affect positions; kill instances when their owned elements are removed.

## Decision Gates

| Need | Pattern |
| --- | --- |
| Discrete reveal | A top-level tween with `trigger`, `start`, `end`, and `toggleActions` |
| Continuous progress | `scrub: true` or a small numeric scrub value |
| Pinned sequence | A timeline with `pin: true` and an explicit scroll range |
| Standalone state callback | `ScrollTrigger.create()` |
| Third-party smooth scroller | `scrollerProxy()` plus a listener that calls `ScrollTrigger.update` |
| Fake horizontal scroll | Animate an inner child with `ease: "none"`; use `containerAnimation` for nested triggers |

## Execution Steps

1. Identify the trigger, scroller, start/end positions, and whether behavior is discrete or continuous.
2. Register `ScrollTrigger`, create triggers in page order, and scope selectors to the owning component where possible.
3. Put the scroll config on a top-level animation; animate children of a pinned container and use `ease: "none"` for horizontal container animations.
4. Test viewport changes, dynamic content, reduced motion, keyboard access, and marker-free production output.
5. Refresh only after real layout changes and kill owned triggers during teardown.

```js
gsap.registerPlugin(ScrollTrigger);

const reveal = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
});
reveal.from(section.querySelectorAll(".item"), { y: 24, autoAlpha: 0, stagger: 0.1 });
```

## Output Contract

Return the trigger model, start/end behavior, scrub or toggle choice, pin/scroller decisions, refresh and teardown strategy, and verification performed.

## References

- `../../apps/halisco-landing/AGENTS.md` — Halisco static-rendering and client-runtime constraints.
