---
name: skill-creator
description: "Trigger: new skill, agent instructions, reusable AI workflow. Create scoped project skills under the repository contract."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [root]
  auto_invoke:
    - "Creating or updating a reusable project skill"
    - "Documenting project-specific runtime instructions for agents"
---

## Activation Contract

Create a skill only for a reusable workflow, project-specific convention, or decision path that agents must execute consistently.

## Hard Rules

- Read `docs/skill-style-guide.md` before creating or updating a skill; it is normative.
- Treat a skill as an LLM runtime contract, not general documentation.
- Keep `SKILL.md` concise and move durable detail to local `references/`, reusable material to `assets/`, and automation to `scripts/`.
- Use only `root` and `halisco-landing` in `metadata.scope`; assign every intended catalog explicitly.
- Keep the description one-line, quoted, trigger-first, YAML-safe, and within the documented length limit.
- Do not add a Keywords section or external-only references.

## Decision Gates

| Need | Location |
| --- | --- |
| Reusable agent behavior | New or updated `SKILL.md` |
| Template, fixture, or schema | `assets/` |
| Long explanation or command inventory | `references/` |
| Deterministic repeated operation | `scripts/` |
| One-off or human-only information | Normal documentation, not a skill |

## Execution Steps

1. Confirm no existing skill owns the behavior.
2. Choose exact scopes from the two supported catalogs.
3. Start from `assets/SKILL-TEMPLATE.md` and follow the normative guide.
4. Run skill-sync in dry-run mode for all affected scopes.
5. Apply catalog updates only after the preview is correct and requested.

## Output Contract

Return files created or changed, selected scopes, supporting resources, style-guide compliance, and catalog sync status.

## References

- `../../docs/skill-style-guide.md` - normative project skill contract.
- `assets/SKILL-TEMPLATE.md` - compliant starting template.
