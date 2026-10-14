# AH Landings Agent Guide

This workspace holds the public landing sites of the AH ecosystem, plus shared guidance and project skills. Dependencies install through one root pnpm workspace (`pnpm-workspace.yaml`, single `pnpm-lock.yaml`); there are no root scripts, so commands run inside each application. The internal system (API, internal client, shared domain package) lives in a separate repository: <https://github.com/NogyOne/ah-system>.

## Topology

| Path | Status | Ownership |
| --- | --- | --- |
| `apps/halisco-landing/` | Active Astro application | Follow `apps/halisco-landing/AGENTS.md` and its `docs/` |
| `skills/` | Shared agent skills | Root-owned; routed by skill metadata |
| `docs/` | Workspace documentation | Cross-project topology, decisions, and conventions |

An Aurus landing is planned; the `aurus-web` commit scope is reserved for it. No `apps/aurus-landing/` directory exists yet.

## Scope Routing

- Use this file for workspace coordination, shared documentation, and shared skills.
- Active applications under `apps/` own their source, configuration, local instructions, and implementation documentation.
- For work inside an application, load this file first, then treat that application's `AGENTS.md` as the local implementation truth.
- Do not infer tools, commands, or architecture for applications that do not exist yet.

## Workflow

- Verify behavior from files and runnable commands before documenting it.
- Keep application implementation and application-specific docs in the owning app.
- Never commit an app-local `pnpm-lock.yaml` or `pnpm-workspace.yaml`; install from the root and record build-script approvals in the root `pnpm-workspace.yaml`.
- Keep cross-project architecture and conventions in `docs/`.
- Create `decisions/`, `patterns/`, `runbooks/`, or acceptance documentation only when real content exists.
- Do not describe planned topology as current behavior.
- The Halisco site deploys as the Cloudflare Worker `halisco-web` (`apps/halisco-landing/wrangler.jsonc`); the Git-connected build uses `apps/halisco-landing` as its root directory, so keep that path and the worker name stable.

## Git Conventions

- Commit and PR titles use Conventional Commits: `type(scope): concise description`.
- Controlled scopes are `halisco-web`, `aurus-web` (reserved for the planned Aurus landing), and `workspace`.
- `halisco-web` covers `apps/halisco-landing/`.
- Use `workspace` for shared tooling, documentation, or cross-cutting repository work.
- Examples: `feat(halisco-web): ...`, `fix(aurus-web): ...`, `chore(workspace): ...`.

## Skills

<!-- skill-sync:start -->
| **Skill** | **Triggers** | **Path** |
| --- | --- | --- |
| `appledouble-cleanup` | Trigger: AppleDouble cleanup, ._* files, macOS sidecars. Safely scan or remove narrow AppleDouble artifacts. | [SKILL.md](skills/appledouble-cleanup/SKILL.md) |
| `docs-alignment` | Trigger: documentation change, workflow change, architecture docs, README, contributor guidance. Keep documentation aligned with current behavior in the workspace and its applications. | [SKILL.md](skills/docs-alignment/SKILL.md) |
| `seo-geo` | Trigger: SEO audit, GEO audit, technical SEO, local SEO, structured data, hreflang, robots.txt, sitemap, metadata, AI search. Audit, apply, and verify evidence-based search quality without invented facts or ranking promises. | [SKILL.md](skills/seo-geo/SKILL.md) |
| `skill-creator` | Trigger: new skill, agent instructions, reusable AI workflow. Create scoped project skills under the repository contract. | [SKILL.md](skills/skill-creator/SKILL.md) |
| `skill-sync` | Trigger: skill sync, update skill catalogs, AGENTS Skills table. Route project skills to managed scope catalogs. | [SKILL.md](skills/skill-sync/SKILL.md) |
<!-- skill-sync:end -->

## Skill Loading Rule

Before changing files under `apps/<app>/`, read that application's `AGENTS.md`, match the request and target files against its Skills table (and this one), and read every matching `SKILL.md` in full. This applies even when working from the workspace root. Do not rely on the table summary or begin that work before the matching skills are loaded. When delegating, give the agent the exact `AGENTS.md` and `SKILL.md` paths to read first.

## Documentation

- [Workspace documentation index](docs/README.md)
- [Workspace architecture](docs/architecture.md)
- [Skill creation guidance](skills/skill-creator/SKILL.md)
- [Halisco documentation index](apps/halisco-landing/docs/README.md)
