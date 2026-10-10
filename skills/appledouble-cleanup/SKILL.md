---
name: appledouble-cleanup
description: "Trigger: AppleDouble cleanup, ._* files, macOS sidecars. Safely scan or remove narrow AppleDouble artifacts."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [root, halisco-landing, api, ah-client]
  auto_invoke:
    - "Scanning the workspace for macOS AppleDouble sidecars"
    - "Diagnosing loader failures caused by resource sidecars"
---

## Activation Contract

Load this skill to inspect or remove macOS AppleDouble `._*` regular files in this ecosystem.

## Hard Rules

- Run `scripts/cleanup-appledouble.sh`; do not improvise deletion commands.
- Keep dry-run as the default. Pass `--apply` only after explicit user approval.
- Match only regular files whose basename is `._*`; never expand to `.DS_Store`, caches, directories, or unrelated files.
- Reject `/` as a scan root and exclude `node_modules` by default.

## Decision Gates

| Situation | Mode |
| --- | --- |
| Normal inspection | Default dry-run |
| Native dependency or loader failure suggests sidecars | Dry-run with `--include-dependencies` |
| User explicitly approves reviewed deletions | Repeat the reviewed command with `--apply` |

## Execution Steps

1. Run the default dry-run from the workspace root.
2. Review every reported candidate.
3. Include dependencies only when the failure evidence requires it.
4. Apply only with explicit approval, then report the script verification count.

## Output Contract

Return the root, dependency mode, operation mode, candidate count, and deletion or remaining counts when applicable.

Verification: `./skills/appledouble-cleanup/tests/test.sh`.

## References

- `scripts/cleanup-appledouble.sh` - deterministic scan and cleanup executable.
