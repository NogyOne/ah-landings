---
name: skill-sync
description: "Trigger: skill sync, update skill catalogs, AGENTS Skills table. Route project skills to managed scope catalogs."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [root]
  auto_invoke:
    - "After creating, changing, moving, or removing a project skill"
    - "Regenerating root or Halisco AGENTS Skills tables"
---

## Activation Contract

Load this skill to synchronize `skills/*/SKILL.md` metadata into the managed Skills tables for root and Halisco AGENTS files.

## Hard Rules

- Discover skills only from workspace-root `skills/*/SKILL.md`.
- Treat `metadata.scope` as required and authoritative; reject missing or unknown scopes.
- Support only `root` and `halisco-landing`.
- Sort rows deterministically by skill name.
- Update only content between `skill-sync:start` and `skill-sync:end` markers.
- Preview by default when policy requires it; apply only after reviewing exact membership.
- Preserve Prowler attribution and the bundled Apache-2.0 license.

## Decision Gates

| Need | Command |
| --- | --- |
| Preview all catalogs | `./skills/skill-sync/scripts/sync.sh --dry-run` |
| Preview one catalog | Add `--scope root` or `--scope halisco-landing` |
| Apply reviewed catalogs | Remove `--dry-run` |

## Execution Steps

1. Validate every discovered skill's name, description, and scopes.
2. Run all-scope and affected single-scope dry-runs.
3. Confirm exact membership and relative paths.
4. Apply only the reviewed scope set, then rerun dry-run to prove idempotence.

## Output Contract

Return scopes processed, files changed or unchanged, validation failures, and whether execution was dry-run or apply.

Verification: `./skills/skill-sync/tests/test.sh`.

## References

- `references/ATTRIBUTION.md` - upstream source and license record.
- `references/LICENSE-APACHE-2.0.txt` - retained source license.
