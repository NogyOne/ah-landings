---
name: gsap-core
description: "Trigger: GSAP core, gsap.to(), gsap.from(), gsap.fromTo(), easing, stagger, matchMedia. Apply framework-agnostic tween patterns with responsive and reduced-motion support."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [halisco-landing]
  auto_invoke:
    - "Implementing or reviewing core GSAP tweens in Halisco"
    - "Choosing tween, easing, stagger, or reduced-motion patterns for a Halisco animation"
---

## Activation Contract

Load this skill for core GSAP tweens, eases, staggers, transform or opacity animation, and responsive motion setup in Halisco.

## Hard Rules

- Use `gsap.to()`, `gsap.from()`, `gsap.fromTo()`, and `gsap.set()` for the smallest clear animation primitive.
- Use camelCase vars and transform aliases such as `x`, `y`, `scale`, and `rotation`; prefer `autoAlpha` when a hidden element must not receive interaction.
- Prefer a timeline for multiple steps. Store the returned Tween or Timeline when it must be paused, reversed, killed, or otherwise controlled.
- Use documented eases only. Set `immediateRender: false` on later overlapping `from()` or `fromTo()` animations targeting the same property.
- Use `gsap.matchMedia()` for breakpoints and `prefers-reduced-motion`; reduce duration to `0` or skip non-essential motion when requested.

## Decision Gates

| Need | Pattern |
| --- | --- |
| One state change | `gsap.to()` or `gsap.set()` |
| Entrance from a known state | `gsap.from()` or explicit `gsap.fromTo()` |
| Several coordinated steps | `gsap.timeline()`; see `gsap-timeline` |
| Scroll-linked progress | `ScrollTrigger`; see `gsap-scrolltrigger` |
| Frequent pointer or resize updates | `gsap.quickTo()`; see `gsap-performance` |

## Execution Steps

1. Identify targets and the visual start/end states without changing layout unnecessarily.
2. Choose the smallest tween primitive, use transform aliases, and add duration, ease, and stagger deliberately.
3. Scope selectors to the owning component when the runtime is component-local.
4. Add `matchMedia()` conditions and a reduced-motion branch before shipping motion.
5. Verify interruption, cleanup, keyboard interaction, and the no-motion path.

```js
const mm = gsap.matchMedia();
mm.add({ desktop: "(min-width: 800px)", mobile: "(max-width: 799px)", reduce: "(prefers-reduced-motion: reduce)" }, ({ conditions }) => {
  gsap.from(".hero-title", {
    y: conditions.reduce ? 0 : conditions.desktop ? 24 : 16,
    autoAlpha: conditions.reduce ? 1 : 0,
    duration: conditions.reduce ? 0 : 0.7,
    ease: "power2.out"
  });
});
```

## Output Contract

Return the targets, tween or timeline choice, responsive and reduced-motion behavior, cleanup strategy, and verification performed.

## References

- `../../apps/halisco-landing/AGENTS.md` — Halisco static-rendering and client-runtime constraints.
