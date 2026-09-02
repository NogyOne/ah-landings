# Halisco Landing Architecture

Halisco Landing is an Astro site configured for static output. The current implementation slice ships the approved desktop and mobile Hero and Jewelry sections with a responsive shared navigation foundation.

## Verified Baseline

| Area | Evidence | Current behavior |
| --- | --- | --- |
| Framework | `package.json`, `pnpm-lock.yaml` | Astro `7.2.4` |
| Runtime | `package.json` | Node.js `>=22.12.0` |
| TypeScript | `tsconfig.json` | Extends `astro/tsconfigs/strict` |
| Rendering | `astro.config.mjs` | Default static output; no adapter or output override |
| Routing | `src/pages/index.astro` | One root page using file-based routing |
| UI | `src/layouts/`, `src/components/site/`, `src/components/ui/`, `src/components/sections/`, `src/pages/index.astro` | Static Halisco first viewport with a mobile-first Hero, Jewelry collage, fixed responsive site chrome, a reusable SectionContainer layout primitive, and a reusable CTA component |
| Client runtime | `src/components/site/Navbar.astro` | One processed strict TypeScript client script colocated with the Navbar component for the single-button mobile menu, MorphIcon mutation, overlay close, Escape, scroll locking, focus transfer/restore, optional link close, responsive reset, and stable custom events; no framework island or ClientRouter |
| Design tooling | `opencode.json` | OpenPencil MCP configured at `/opt/homebrew/bin/openpencil-mcp` |

## Source Boundaries

```text
src/pages/        # Astro routes
src/layouts/      # Astro page/document shells
src/components/site/     # Persistent Halisco brand/site chrome
src/components/ui/       # Reusable visual/layout primitives
src/components/sections/ # Page sections
src/assets/       # Optimized local source assets
src/styles/       # Global resets, accessibility primitives, and Tailwind CSS-first theme tokens
public/           # Static public assets
docs/             # Local implementation and design documentation
astro.config.mjs  # Astro runtime/build configuration
tsconfig.json     # Strict TypeScript configuration
```

No UI framework integration, content collection, server adapter, API layer, or test/check command is currently declared. Component-owned visual rules are Tailwind utilities in component markup; `global.css` remains limited to seven semantic theme-scoped color roles, the existing font tokens, document-wide reset/base behavior, and accessibility primitives. `SectionContainer.astro` owns the semantic section shell, centered max-width inner geometry, mobile `px-5` gutters, desktop `lg:px-8` gutters, and named background slot used by non-Hero sections. The Hero uses a mobile-first full-bleed crop with a minimum height and a two-button touch-sized CTA row, then restores the desktop composition at `lg`. Jewelry stacks its copy before a CSS Grid-overlapped three-image editorial collage on mobile and restores its 12-column desktop layout at `lg`. Astro assets generate 1x and 2x density candidates for the hero, logo, and Jewelry collage images.

`Navbar.astro` owns one fixed header, the desktop links, the mobile drawer markup, and its processed client runtime. The desktop links and mobile controls switch at the content-driven `lg` breakpoint. The drawer is a right-side themed panel with a separate dark backdrop, CSS transform/opacity transitions, `aria-hidden`, `inert`, and 44px controls. The colocated script owns the single persistent mobile toggle, dynamic ARIA state, MorphIcon `morphTo` state, overlay-click close, Escape, focus restoration, scroll locking, responsive desktop reset, and the GSAP link stagger timeline. The open and close paths dispatch `mobile-menu:opened` and `mobile-menu:closed` from the navbar root for the link animation hook. Morphicons, overlay-click close, and GSAP link staggering are implemented; scroll-direction Navbar motion remains an unimplemented exercise.

## Change Discipline

- Confirm current behavior from source and package configuration before updating this document.
- Treat [the design brief](design-brief.md) as accepted intent and this document as implementation truth.
- Keep workspace-wide architecture in [the root architecture document](../../../docs/architecture.md).
