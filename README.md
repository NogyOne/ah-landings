# AH Landings

AH Landings is the repository for the public landing sites of the AH ecosystem, a family of jewelry businesses. Workspace-wide conventions, documentation, and agent skills live at the root; each application owns its implementation under `apps/`.

The internal system (API, internal client, shared domain package) lives in a separate repository: <https://github.com/NogyOne/ah-system>.

## Applications

| Application | Status | Purpose |
| --- | --- | --- |
| [Halisco Landing](apps/halisco-landing/) | Active | Astro customer-facing landing, deployed as the Cloudflare Worker `halisco-web` |

An Aurus landing is planned but does not exist yet.

## Working in an Application

Run `pnpm install` once at the root: it is a pnpm workspace with a single lockfile. There are no root scripts, so enter the application and use its local commands. Halisco work follows [its agent guide](apps/halisco-landing/AGENTS.md) and [documentation index](apps/halisco-landing/docs/README.md).

## Repository Structure

```text
ah-landings/
├── apps/
│   └── halisco-landing/   # Active Astro application
├── docs/                  # Workspace topology and shared conventions
└── skills/                # Shared, metadata-routed agent workflows
```

## Documentation

- [Workspace documentation](docs/README.md)
- [Workspace architecture](docs/architecture.md)
- [Halisco documentation](apps/halisco-landing/docs/README.md)
