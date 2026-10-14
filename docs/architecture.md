# Workspace Architecture

AH Landings is a coordination workspace for the public landing applications of the AH ecosystem. Dependencies are installed through one pnpm workspace: `pnpm-workspace.yaml` includes `apps/*`, and the root `pnpm-lock.yaml` is the only lockfile. There is no root `package.json` or root script, so each application keeps its own commands. The internal system lives in a separate repository: <https://github.com/NogyOne/ah-system>.

## Ownership Model

| Concern | Canonical owner |
| --- | --- |
| Application source, runtime, dependencies, and configuration | The application directory under `apps/<application>/` |
| Application-specific agent instructions | `apps/<application>/AGENTS.md` |
| Application architecture and implementation documentation | `apps/<application>/docs/` |
| Workspace topology and shared conventions | Root `AGENTS.md` and `docs/` |
| Shared agent workflows | Root `skills/`, routed by supported `metadata.scope` values |

Root documentation links to application-owned detail instead of restating it.

## Current Topology

| Path | Current state | Local ownership |
| --- | --- | --- |
| `apps/halisco-landing/` | Active Astro application, deployed as the Cloudflare Worker `halisco-web` | Local `AGENTS.md` and `docs/` |
| `docs/` | Active workspace documentation | Root-owned shared facts and conventions |
| `skills/` | Active shared agent skills | Root-owned and metadata-routed |

The Cloudflare Git integration builds from the root directory `apps/halisco-landing`, so that path and the worker name in its `wrangler.jsonc` must stay stable.

## Current Truth and Planned Work

Document a component as active only when implementation and executable configuration exist. An Aurus landing is planned and the `aurus-web` commit scope is reserved for it, but no application directory, runtime, or documentation exists yet.

Do not claim root scripts or task orchestration until a root manifest and runnable workspace commands establish it.
