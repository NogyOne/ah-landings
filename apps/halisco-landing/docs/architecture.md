# Halisco Landing Architecture

Halisco Landing is currently a minimal Astro site configured for static output.

## Verified Baseline

| Area | Evidence | Current behavior |
| --- | --- | --- |
| Framework | `package.json`, `pnpm-lock.yaml` | Astro `7.2.4` |
| Runtime | `package.json` | Node.js `>=22.12.0` |
| TypeScript | `tsconfig.json` | Extends `astro/tsconfigs/strict` |
| Rendering | `astro.config.mjs` | Default static output; no adapter or output override |
| Routing | `src/pages/index.astro` | One root page using file-based routing |
| UI | `src/pages/index.astro` | Starter HTML only; the design brief is not implemented yet |
| Design tooling | `opencode.json` | OpenPencil MCP configured at `/opt/homebrew/bin/openpencil-mcp` |

## Source Boundaries

```text
src/pages/        # Astro routes
public/           # Static public assets
docs/             # Local implementation and design documentation
astro.config.mjs  # Astro runtime/build configuration
tsconfig.json     # Strict TypeScript configuration
```

No UI framework integration, content collection, server adapter, API layer, or test/check command is currently declared.

## Change Discipline

- Confirm current behavior from source and package configuration before updating this document.
- Treat [the design brief](design-brief.md) as accepted intent and this document as implementation truth.
- Keep workspace-wide architecture in [the root architecture document](../../../docs/architecture.md).
