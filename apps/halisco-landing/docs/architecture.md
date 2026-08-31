# Halisco Landing Architecture

Halisco Landing is an Astro site configured for static output. The current implementation slice ships the approved desktop hero and Jewelry sections with a shared navigation foundation.

## Verified Baseline

| Area | Evidence | Current behavior |
| --- | --- | --- |
| Framework | `package.json`, `pnpm-lock.yaml` | Astro `7.2.4` |
| Runtime | `package.json` | Node.js `>=22.12.0` |
| TypeScript | `tsconfig.json` | Extends `astro/tsconfigs/strict` |
| Rendering | `astro.config.mjs` | Default static output; no adapter or output override |
| Routing | `src/pages/index.astro` | One root page using file-based routing |
| UI | `src/layouts/`, `src/components/site/`, `src/components/ui/`, `src/components/sections/`, `src/pages/index.astro` | Static Halisco desktop first viewport with an Astro page shell, persistent site chrome, owned Hero and Jewelry sections, a reusable SectionContainer layout primitive, and a reusable CTA component |
| Client runtime | `src/` | No client JavaScript or hydrated islands |
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

No UI framework integration, content collection, server adapter, API layer, or test/check command is currently declared. Component-owned visual rules are Tailwind utilities in component markup; `global.css` remains limited to seven semantic theme-scoped color roles, the existing font tokens, document-wide reset/base behavior, and accessibility primitives. `SectionContainer.astro` owns the semantic section shell, centered max-width inner geometry, and named background slot used by non-Hero sections. Astro assets generate 1x and 2x density candidates for the fixed desktop hero, logo, and Jewelry collage images. The implemented slice is intentionally desktop-only and includes no later landing chapters or responsive redesign.

## Change Discipline

- Confirm current behavior from source and package configuration before updating this document.
- Treat [the design brief](design-brief.md) as accepted intent and this document as implementation truth.
- Keep workspace-wide architecture in [the root architecture document](../../../docs/architecture.md).
