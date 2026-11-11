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

## Search Foundation

- `astro.config.mjs` sets the production origin to `https://joyeriahalisco.com/`; `BaseLayout.astro` emits an absolute canonical from that origin and the page pathname. `index.astro` owns the Spanish homepage title and description.
- `public/robots.txt`, `public/sitemap.xml`, and `public/llms.txt` are static passthrough files. The manual sitemap lists only the homepage; update it when indexable routes change. Keep its URLs and factual llms content aligned with the page. llms.txt is project policy, not a Google ranking requirement.
- `index.astro` owns the minimal static JewelryStore JSON-LD, emitted through the layout's named head slot with less-than characters escaped before raw HTML insertion. Its address, hours, map coordinates, and explicitly labeled WhatsApp contact must stay aligned with visible business facts. Gold-focused metadata does not remove visible silver services or factual llms content.
- The layout links the existing Apple touch icon and `public/site.webmanifest`; manifest names and dark colors identify the site, without a service worker or app-install claim.
- `BaseLayout.astro` emits Open Graph and X large-image card metadata from the same title/description props and production canonical. The owner-supplied `public/og-card.png` is an unchanged 1672x941 PNG at the stable absolute URL `https://joyeriahalisco.com/og-card.png`; no account handles or substitute assets are invented. When replacing it, preserve the approved design and update MIME/dimensions/alt and generated-output checks together. Platform previews remain consumer-dependent until observed after publication.
- Local source configuration does not configure DNS, HTTPS redirects, Search Console, or the deployed robots policy. Local changes are not live until separately published. For an owner-operated HTTPS redirect, use Cloudflare Rules > Overview > Create rule > Redirect Rule, match only `http://joyeriahalisco.com/*`, target `https://joyeriahalisco.com/${1}`, select 301 and preserve query string, then verify path/query retention and no loops. Follow the [official dashboard instructions](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/); labels may vary. No account change is performed by this repository or its checks.
- After `pnpm build`, run `node --test tests/seo-foundation.test.mjs` to inspect generated metadata, discovery files, links, and factual consistency. The check uses Node's test runner and Python 3's standard-library HTML/XML parsers; it does not install dependencies or verify deployment/indexing.

## Documentation Boundaries

- This document is implementation truth for architecture, ownership, structure, configuration, and runtime boundaries.
- [The design brief](design-brief.md) is accepted product and visual intent, not proof of shipped behavior.
- Keep current-state claims backed by source files or runnable commands.
- Do not turn this document into a catalog of page content or individual page compositions.
- Keep workspace-wide architecture in [the root architecture document](../../../docs/architecture.md).
