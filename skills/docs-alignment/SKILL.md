---
name: docs-alignment
description: "Trigger: documentation change, workflow change, architecture docs, README, contributor guidance. Keep documentation aligned with current behavior in the workspace and its applications."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "2.1"
  scope: [root, halisco-landing]
  auto_invoke:
    - "Changing behavior, setup, commands, architecture, or contributor workflow"
    - "Creating or reviewing workspace or application documentation"
---

## When to Use

Use this skill when:

- Changing APIs, setup flows, commands, or runtime behavior.
- Updating commands, scripts, or examples.
- Writing or reviewing contributor guidance, architecture notes, or an `AGENTS.md`.

## Alignment Rules

1. Docs describe current, verified behavior, not intended behavior.
2. Update docs in the same change (and commit) as the code.
3. Validate commands, paths, and examples before publishing.
4. Remove references to deprecated files, endpoints, scripts, or commands.
5. Workspace-wide facts live in root `docs/`; application facts live in the owning `apps/<app>/docs/`.
6. Keep one canonical owner per fact and link to it instead of duplicating it.
7. Keep documentation links in each `AGENTS.md` current.
8. Design briefs and intent documents record intent, not implementation truth; never present them as current behavior.
9. Create specialized documentation directories (`decisions/`, `runbooks/`, ...) only when real content exists.

## Verification

- [ ] Endpoint names match server routes
- [ ] Script and command names match repository paths and manifests
- [ ] Command examples execute as documented
- [ ] Links and `AGENTS.md` documentation sections resolve
- [ ] Cross-agent notes are still accurate
- [ ] Intent-only documents do not claim implementation

## Output Contract

Return the documentation owners reviewed, files changed, evidence checked, and any intentional documentation gap.

## Resources

- **Documentation**: [Workspace documentation index](../../docs/README.md); each application's index is `apps/<app>/docs/README.md`.
