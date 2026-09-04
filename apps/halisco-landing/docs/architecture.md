# Halisco Landing Architecture

Halisco Landing is an Astro application configured for static output. This document records the verified project structure, ownership rules, rendering boundaries, and configuration conventions. Product and visual direction belong in [the design brief](design-brief.md), not here.

## Verified Baseline

| Area | Evidence | Current behavior |
| --- | --- | --- |
| Framework | `package.json`, `pnpm-lock.yaml` | Astro `7.2.4` |
| Runtime | `package.json` | Node.js `>=22.12.0` |
| TypeScript | `tsconfig.json` | Extends `astro/tsconfigs/strict` |
| Rendering | `astro.config.mjs` | Static output with no adapter or output override |
| Routing | `src/pages/` | Astro file-based routing |
| Styling and build | `astro.config.mjs`, `src/styles/global.css` | Tailwind CSS v4 through the Vite plugin; global theme tokens, resets, and accessibility primitives are loaded by the document layout |
| Client runtime | Component-owned `<script>` blocks | Client scripts may be colocated with owning components for concrete browser interactions; no framework island or ClientRouter is declared |
| Design tooling | `opencode.json` | OpenPencil MCP configured at `/opt/homebrew/bin/openpencil-mcp` |

## Source Boundaries

```text
src/pages/                 # Astro routes and page composition
src/layouts/               # Document shells and page-level layout
src/components/site/       # Persistent brand and site chrome
src/components/ui/         # Reusable visual and layout primitives
src/components/sections/   # Page-specific section components
src/assets/                # Optimized local source assets
src/styles/                # Global CSS, resets, accessibility, and theme tokens
public/                    # Passthrough assets with stable public URLs
docs/                      # Halisco implementation documentation and design intent
astro.config.mjs           # Astro and Vite configuration
tsconfig.json              # Strict TypeScript and import aliases
package.json               # Runtime, dependency, and package-script contract
```

## Ownership and Component Categories

- `src/pages/` owns route entrypoints and the order in which page-level components are composed.
- `src/layouts/` owns the document shell, metadata, global stylesheet loading, and persistent layout composition.
- `src/components/site/` owns persistent site chrome, navigation, and any colocated client behavior required by that chrome.
- `src/components/ui/` owns primitives that have real reuse across page-level components. A new abstraction requires an actual shared ownership boundary or reuse case.
- `src/components/sections/` owns page-specific composition. Keep section data, markup, and section-specific styling together unless a separate asset or primitive has an independent owner.
- `src/assets/` owns local source assets that should pass through Astro's asset pipeline. Organize images by domain under `src/assets/images/brand/`, `hero/`, `jewelry/`, `workmanship/`, `work-gallery/`, and `repairs/`; import them from source files rather than referencing generated output directly.
- `src/styles/` owns document-wide CSS concerns and semantic theme tokens. Component-specific visual rules stay with the owning component when utilities or local styles are sufficient.
- `public/` owns passthrough assets that need stable URLs or are not part of the optimized local asset pipeline.
- `docs/` owns verified implementation facts and accepted design intent. Keep workspace-wide conventions in the root documentation.

## Rendering and Runtime Boundaries

- Keep the application static by default. Do not add a server adapter or change output mode without a verified server-side requirement.
- Astro components render on the server/build path and should ship no client JavaScript by default.
- Add a client script only for concrete browser behavior that static HTML and CSS cannot provide. Keep component-specific scripts colocated with their owning component.
- Do not add a framework island, ClientRouter, content collection, API layer, or other runtime integration unless the project contract changes to require it.
- Use semantic HTML, accessible names, keyboard-accessible controls, and the existing document-wide focus primitives for interactive behavior.
- Use `astro:assets` with imported local images for optimizable media. Provide meaningful alternative text for informative images and explicit dimensions or stable CSS sizing to prevent layout shift.

## Configuration and Import Aliases

`astro.config.mjs` enables the Tailwind CSS Vite plugin. `tsconfig.json` extends Astro's strict configuration and defines these aliases:

| Alias | Resolves to |
| --- | --- |
| `@/*` | `src/*` |
| `@layouts/*` | `src/layouts/*` |
| `@components/*` | `src/components/*` |
| `@sections/*` | `src/components/sections/*` |
| `@ui/*` | `src/components/ui/*` |
| `@site/*` | `src/components/site/*` |
| `@pages/*` | `src/pages/*` |
| `@styles/*` | `src/styles/*` |
| `@assets/*` | `src/assets/*` |
| `@public/*` | `public/*` |

Use the narrowest established alias for imports. Dependency declarations and package-script ownership remain in `package.json`.

## Documentation Boundaries

- This document is implementation truth for architecture, ownership, structure, configuration, and runtime boundaries.
- [The design brief](design-brief.md) is accepted product and visual intent, not proof of shipped behavior.
- Keep current-state claims backed by source files or runnable commands.
- Do not turn this document into a catalog of page content or individual page compositions.
- Keep workspace-wide architecture in [the root architecture document](../../../docs/architecture.md).
