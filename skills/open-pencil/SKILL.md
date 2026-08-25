---
name: open-pencil
description: "Trigger: OpenPencil, .fig design, design inspection, design mutation. Use the configured MCP safely for Halisco design work."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [halisco-landing]
  auto_invoke:
    - "Inspecting or editing an OpenPencil design for Halisco"
    - "Translating design structure into Astro, HTML, CSS, or TypeScript"
---

## Activation Contract

Load this skill for Halisco `.fig` work or the configured OpenPencil MCP. The project config declares `/opt/homebrew/bin/openpencil-mcp`; a standalone `openpencil` CLI is not project-verified.

## Hard Rules

- Default to read-only inspection: query pages, nodes, structure, styles, bounds, or exports that do not overwrite source files.
- Do not mutate a live document, save a file, overwrite an export, or delete/reparent nodes without an explicit mutation request.
- Inspect the current document and selection before any approved mutation.
- Translate approved designs into Astro, semantic HTML, CSS, and TypeScript; do not introduce framework code absent from the app.
- Verify visually after mutation and report the affected document and node IDs.

## Decision Gates

| Request | Gate |
| --- | --- |
| Inspect, compare, or analyze | Read-only MCP operations are allowed |
| Export to a new path | Confirm destination and avoid overwrite |
| Edit, create, delete, save, or overwrite | Require explicit mutation intent |
| Use standalone CLI | First verify `openpencil` exists and inspect its current help |

## Execution Steps

1. Confirm MCP availability and document context.
2. Query the narrowest useful page or node set.
3. Obtain explicit mutation intent when the request is not already clear.
4. Apply the smallest change, inspect the result, and save only when requested.

## Output Contract

Return the access mode, document or file, nodes inspected or changed, persistence status, and verification performed.

## References

- `references/cli-and-mcp-reference.md` - capability map and safe command guidance.
- `../../apps/halisco-landing/opencode.json` - local MCP configuration evidence.
