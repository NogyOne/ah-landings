---
name: gsap-timeline
description: "Trigger: GSAP timeline, sequencing, keyframes, position parameter, labels, playback. Build maintainable multi-step animation choreography."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [halisco-landing]
  auto_invoke:
    - "Building or reviewing multi-step GSAP animation choreography in Halisco"
    - "Sequencing, overlapping, labeling, or controlling related GSAP tweens"
---

## Activation Contract

Load this skill when several GSAP tweens must run in sequence or parallel, or when animation timing, labels, playback, or keyframe-style choreography matters.

## Hard Rules

- Use `gsap.timeline()` instead of chaining unrelated delays. Put shared `duration` and `ease` in `defaults`.
- Use the position parameter to place children: absolute times, `"+=0.2"`, `"<"`, `"<0.2"`, or named labels.
- Put `ScrollTrigger` on the timeline or another top-level animation, never on a child tween.
- Store the timeline when it must be paused, reversed, restarted, scrubbed, or killed.
- Kill or revert the timeline when its component-owned targets are removed.

## Decision Gates

| Need | Pattern |
| --- | --- |
| Sequential steps | Append tweens to one timeline |
| Parallel or overlapping steps | Use `"<"`, `"<0.2"`, or an explicit time |
| Readable milestones | Add named labels and place tweens relative to them |
| Scroll-linked choreography | Configure `ScrollTrigger` on the timeline; see `gsap-scrolltrigger` |
| Single independent tween | Use `gsap-core` instead |

## Execution Steps

1. Define the visual milestones and identify which targets may overlap.
2. Create one timeline with shared defaults and meaningful labels.
3. Place each tween with the position parameter rather than accumulating `delay` values.
4. Add callbacks or playback controls only where the behavior needs them.
5. Verify forward, reverse, interruption, reduced-motion, and teardown behavior.

```js
const intro = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
intro
  .addLabel("start")
  .from(".eyebrow", { y: 12, autoAlpha: 0 })
  .from(".title", { y: 24, autoAlpha: 0 }, "<0.1")
  .from(".actions", { y: 16, autoAlpha: 0 }, ">-0.2")
  .addLabel("ready");
```

## Output Contract

Return the timeline structure, defaults, timing/label decisions, playback controls, cleanup strategy, and verification performed.

## References

- `../../apps/halisco-landing/AGENTS.md` — Halisco static-rendering and client-runtime constraints.
