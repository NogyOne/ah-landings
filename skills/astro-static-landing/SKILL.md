---
name: astro-static-landing
description: "Trigger: Astro landing pages, .astro components, static rendering, client islands, astro:assets. Build lean static Halisco experiences."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [halisco-landing]
  auto_invoke:
    - "Creating or changing Halisco Astro pages, components, responsive behavior, client interactions, or assets"
---

## Activation Contract

Load this skill for implementation or review of the Halisco Astro landing experience.

## Hard Rules

- Default to Astro components, semantic HTML, CSS, mobile-first layouts, and static rendering.
- Change output mode or add an adapter only for verified server behavior.
- Ship zero client JavaScript by default; justify every script or hydrated island with concrete behavior.
- Prefer Astro and native browser APIs over UI-framework islands. When an island is necessary, select its `client:*` directive intentionally.
- Import optimizable local images from `src/` through `astro:assets`. Reserve `public/` for passthrough or stable-path assets and provide dimensions where appropriate.
- Extract components, abstractions, or directories only when actual ownership or reuse requires them.
- Keep non-trivial client behavior separate from component markup.
- Do not assume GSAP is installed or duplicate animation implementation guidance.

## Decision Gates

| Situation | Required action |
| --- | --- |
| Server output or adapter proposed | Prove the server requirement before changing static output |
| Client script or framework island proposed | Document the behavior and why static HTML or native APIs are insufficient |
| ClientRouter or View Transitions affect behavior | Verify current Astro lifecycle APIs before choosing initialization and cleanup hooks |
| Animation-specific behavior exists | Load the applicable animation skill for initialization, performance, ScrollTrigger, and cleanup |

## Execution Steps

1. Inspect current requirements, rendering mode, assets, and existing ownership before designing structure.
2. Implement the smallest semantic Astro and CSS solution, mobile first.
3. Add client behavior only after passing the relevant decision gate.
4. Verify the build and gather evidence for responsive behavior, accessibility and reduced-motion semantics where relevant, metadata and SEO basics, image dimensions and layout stability, and avoidable performance regressions.
5. Report checks that could not run instead of claiming guarantees.

## Output Contract

Return changed files, static and client-runtime decisions, image handling, verification evidence, unavailable checks, and remaining risks.

## References

- `../../apps/halisco-landing/AGENTS.md` - current runtime baseline, commands, and local ownership.
