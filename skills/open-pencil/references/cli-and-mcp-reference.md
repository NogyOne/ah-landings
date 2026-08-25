# OpenPencil CLI and MCP Reference

This inventory is adapted from upstream OpenPencil guidance. Tool names can change; inspect the connected MCP tool list or current command help before use.

## Verified Project Evidence

`apps/halisco-landing/opencode.json` enables a local MCP server at `/opt/homebrew/bin/openpencil-mcp`. The project does not declare or verify a standalone `openpencil` CLI.

## MCP Capability Families

| Mode | Typical operations | Safety |
| --- | --- | --- |
| Inspect | Page tree, selection, node lookup, queries, bounds, JSX description, design analysis | Read-only unless the operation changes selection or viewport |
| Export | Image, SVG, or PDF export | Writes output; confirm destination and overwrite behavior |
| Create | Render nodes, create shapes/components/pages, import SVG | Mutates the document |
| Modify | Update nodes, text, fills, layout, effects, variables, or hierarchy | Mutates the document |
| Persist | Open, save, or save-as | Can replace disk state; require explicit intent |

Prefer narrow node queries over full document dumps. After an approved visual change, inspect or export the affected area and focus the viewport when the connected server supports it.

## Standalone CLI Gate

Do not assume installation or syntax. Before any CLI workflow, run:

```bash
command -v openpencil
openpencil --help
```

Continue only if both succeed. Treat `eval`, write flags, conversion, and exports as mutation or disk-write operations.
