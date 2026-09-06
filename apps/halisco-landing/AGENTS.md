# Halisco Landing Agent Guide

This file is the local implementation truth for `apps/halisco-landing/`. Root guidance still applies unless this file is more specific.
The project is about a landing page for a Jewelry Store with the goal of give information about the business and convert leads in physical sales.

## Current Baseline

| Area           | Current state                                                                   |
| -------------- | ------------------------------------------------------------------------------- |
| Framework      | Astro `7.2.4`                                                                   |
| Runtime        | Node.js `>=22.12.0`                                                             |
| TypeScript     | Astro strict configuration                                                      |
| Rendering      | Astro default static output; no server adapter or output override               |

For version-sensitive Astro, Tailwind, or integration APIs, consult
Context7 before implementing rather than relying on potentially outdated APIs.

## Commands

Run commands from this directory with pnpm.

| Purpose                             | Command                    |
| ----------------------------------- | -------------------------- |
| Start development in the background | `pnpm dev -- --background` |
| Inspect the background server       | `pnpm astro dev status`    |
| Read background server logs         | `pnpm astro dev logs`      |
| Stop the background server          | `pnpm astro dev stop`      |
| Build the static site               | `pnpm build`               |
| Preview a build                     | `pnpm preview`             |

Do not claim or run `astro check`: `@astrojs/check` and TypeScript are not declared dependencies.

## Ownership

- `src/` and `public/` own application behavior and assets.
- `src/layouts/` owns Astro page/document shells.
- `src/components/site/` owns persistent Halisco brand/site chrome.
- `src/components/ui/` owns reusable visual/layout primitives.
- `src/components/sections/` owns page-specific sections.
- Page-section components live in `src/components/sections/`; filenames and matching imported component identifiers use English PascalCase and end in `Section` (`Section.astro` for files).
- `src/assets/images/` is organized by asset domain under `brand/`, `hero/`, `jewelry/`, `workmanship/`, `work-gallery/`, and `repairs/`; keep optimized local image imports in their owning domain and use `public/` only for passthrough assets.
- `docs/architecture.md` describes verified implementation structure.
- Root `../../docs/` owns workspace-wide topology and conventions.

## Hard Rules

- Keep rendering static unless an explicit requirement and adapter justify a change.
- Use Astro, semantic HTML, CSS, and TypeScript already supported by the project; do not invent framework integrations.
- Verify package commands against `package.json` before documenting or running them.
- Keep desktop and mobile behavior accessible and functional.
- Do not edit generated output or dependency directories.
- Create decisions, patterns, runbooks, or acceptance docs only when substantive content exists.

## Skills

<!-- skill-sync:start -->
| **Skill** | **Triggers** | **Path** |
| --- | --- | --- |
| `appledouble-cleanup` | Trigger: AppleDouble cleanup, ._* files, macOS sidecars. Safely scan or remove narrow AppleDouble artifacts. | [SKILL.md](../../skills/appledouble-cleanup/SKILL.md) |
| `astro-static-landing` | Trigger: Astro landing pages, .astro components, static rendering, client islands, astro:assets. Build lean static Halisco experiences. | [SKILL.md](../../skills/astro-static-landing/SKILL.md) |
| `docs-alignment` | Trigger: documentation change, workflow change, architecture docs. Keep documentation aligned with current workspace behavior. | [SKILL.md](../../skills/docs-alignment/SKILL.md) |
| `gsap-core` | Trigger: GSAP core, gsap.to(), gsap.from(), gsap.fromTo(), easing, stagger, matchMedia. Apply framework-agnostic tween patterns with responsive and reduced-motion support. | [SKILL.md](../../skills/gsap-core/SKILL.md) |
| `gsap-performance` | Trigger: GSAP performance, jank, FPS, smooth animation, will-change, quickTo. Optimize transforms, batching, and animation cleanup for responsive Halisco interfaces. | [SKILL.md](../../skills/gsap-performance/SKILL.md) |
| `gsap-plugins` | Trigger: GSAP plugins, Flip, FLIP animation, registerPlugin, shared-element transition. Register GSAP plugins and apply Flip layout transitions safely. | [SKILL.md](../../skills/gsap-plugins/SKILL.md) |
| `gsap-scrolltrigger` | Trigger: ScrollTrigger, scroll animation, parallax, pinning, scrub. Build and review scroll-linked GSAP animations with correct registration, refresh, and cleanup. | [SKILL.md](../../skills/gsap-scrolltrigger/SKILL.md) |
| `gsap-timeline` | Trigger: GSAP timeline, sequencing, keyframes, position parameter, labels, playback. Build maintainable multi-step animation choreography. | [SKILL.md](../../skills/gsap-timeline/SKILL.md) |
| `gsap-utils` | Trigger: gsap.utils, clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Apply GSAP utility helpers safely. | [SKILL.md](../../skills/gsap-utils/SKILL.md) |
| `open-pencil` | Trigger: OpenPencil, .fig design, design inspection, design mutation. Use the configured MCP safely for Halisco design work. | [SKILL.md](../../skills/open-pencil/SKILL.md) |
| `typescript` | Trigger: TypeScript, .ts, Astro component types, strict typing. Apply safe TypeScript patterns in Halisco components. | [SKILL.md](../../skills/typescript/SKILL.md) |
<!-- skill-sync:end -->

## Skill Loading Rule

Before task-specific work, match the request and target files against the Skills table, then read every matching `SKILL.md` in full. Do not rely on the table summary or begin that work before the matching skills are loaded.

## Documentation

- [Local documentation index](docs/README.md)
- [Current architecture](docs/architecture.md)
- [Accepted design intent](docs/design-brief.md)
- [Workspace documentation](../../docs/README.md)
