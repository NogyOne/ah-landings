---
name: skill-sync
description: "Trigger: skill sync, update skill catalogs, AGENTS Skills table. Route project skills to managed scope catalogs."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.2"
  scope: [root]
  auto_invoke:
    - "After creating, changing, moving, or removing a project skill"
    - "Regenerating the Skills tables of root or any app or package AGENTS.md that carries skill-sync markers"
---

## Activation Contract

Load this skill to synchronize `skills/*/SKILL.md` metadata into the managed Skills tables for the root `AGENTS.md` and every app or package `AGENTS.md` that opts in with skill-sync markers.

## Hard Rules

- Discover skills only from workspace-root `skills/*/SKILL.md`.
- Treat `metadata.scope` as required and authoritative; reject missing or unknown scopes.
- Discover valid scopes at run time: `root` (root `AGENTS.md`, links `skills/<name>/SKILL.md`) plus every `apps/<app>/AGENTS.md` and `packages/<pkg>/AGENTS.md` that contains both `skill-sync:start` and `skill-sync:end` markers (scope name is the `<app>` or `<pkg>` directory name, links `../../skills/<name>/SKILL.md`; an app and a package may not share a name).
- Reject any scope in skill metadata that was not discovered, including an app whose `AGENTS.md` has no markers.
- Keep each skill out of catalogs not listed in its `metadata.scope`.
- To onboard a new app or package, add a `## Skills` section with an empty `<!-- skill-sync:start -->` / `<!-- skill-sync:end -->` marker pair to `apps/<app>/AGENTS.md` or `packages/<pkg>/AGENTS.md`; no script change is needed.
- Sort rows deterministically by skill name.
- Update only content between `skill-sync:start` and `skill-sync:end` markers.
- Preview by default when policy requires it; apply only after reviewing exact membership.
- Preserve Prowler attribution and the bundled Apache-2.0 license.

## Decision Gates

| Need | Command |
| --- | --- |
| Preview all catalogs | `./skills/skill-sync/scripts/sync.sh --dry-run` |
| Preview one catalog | Add `--scope <name>` with any discovered scope (for example `root`, an app directory name, or a package directory name) |
| Apply reviewed catalogs | Remove `--dry-run` |

## Execution Steps

1. Validate every discovered skill's name, description, and scopes.
2. Run the all-scope dry-run, which processes every discovered scope, plus affected single-scope dry-runs.
3. Confirm exact membership and relative paths for each catalog.
4. Apply only the reviewed scope set, then rerun dry-run to prove idempotence.

## Output Contract

Return scopes processed, files changed or unchanged, validation failures, and whether execution was dry-run or apply.

Verification: `./skills/skill-sync/tests/test.sh`.

## References

- `references/ATTRIBUTION.md` - upstream source and license record.
- `references/LICENSE-APACHE-2.0.txt` - retained source license.
