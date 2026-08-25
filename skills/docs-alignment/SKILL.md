---
name: docs-alignment
description: "Trigger: documentation change, workflow change, architecture docs. Keep documentation aligned with current workspace behavior."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [root, halisco-landing]
  auto_invoke:
    - "Changing behavior, setup, commands, architecture, or contributor workflow"
    - "Creating or reviewing workspace or Halisco documentation"
---

## Activation Contract

Load this skill when a change can make workspace or Halisco documentation inaccurate.

## Hard Rules

- Describe verified current behavior, not intended behavior.
- Keep cross-workspace facts in `docs/` and Halisco facts in `apps/halisco-landing/docs/`.
- Treat the Halisco design brief as accepted intent, not implementation truth.
- Prefer one canonical owner plus links over duplicated guidance.
- Validate commands, paths, and examples before publishing.
- Create specialized documentation directories only when substantive content exists.

## Decision Gates

| Change | Documentation action |
| --- | --- |
| Workspace topology or shared convention | Update root docs |
| Halisco runtime, source structure, or workflow | Update Halisco docs |
| Product or visual intent only | Update the design brief without claiming implementation |
| Internal refactor with no documented effect | No documentation change required |

## Execution Steps

1. Identify the canonical owner.
2. Verify the changed behavior from source or runnable commands.
3. Update the owner and reduce duplicate locations to links.
4. Check introduced links, paths, commands, and current-versus-design wording.

## Output Contract

Return the documentation owners reviewed, files changed, evidence checked, and any intentional documentation gap.

## References

- `../../docs/README.md` - workspace documentation index.
- `../../apps/halisco-landing/docs/README.md` - Halisco documentation index.
