---
name: typescript
description: "Trigger: TypeScript, .ts, Astro component types, strict typing. Apply safe TypeScript patterns in Halisco components."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0-bfsc.1"
  scope: [halisco-landing]
  auto_invoke:
    - "Implementing or refactoring TypeScript in Halisco components"
    - "Tightening types, generics, unknown values, or type guards"
---

## Activation Contract

Load this skill when implementing or refactoring TypeScript used by Halisco Astro components or client scripts.

## Hard Rules

- Preserve Astro's strict TypeScript behavior and existing project conventions.
- Do not use `any`; accept uncertain external values as `unknown` and narrow them before use.
- Prefer inferred types when they remain clear; add explicit types at public boundaries and where inference loses intent.
- Use `import type` for type-only imports.
- Derive a union from an `as const` object when the same values are needed at runtime; use a direct union when no runtime map is needed.
- Use type guards for reusable runtime validation and include null checks when narrowing objects.
- Do not assume path aliases or framework-specific domain rules that the Halisco app does not declare.

## Decision Gates

| Need | Pattern |
| --- | --- |
| Unknown external input | `unknown` plus runtime narrowing |
| Runtime value set and matching type | `as const` object plus indexed access type |
| Type-only value set | Union type |
| Object contract intended for extension | Interface |
| Union, mapped, conditional, or composed type | Type alias |

## Execution Steps

1. Inspect the local Astro component and TypeScript configuration before changing types.
2. Model the narrowest valid inputs and outputs without duplicating runtime constants.
3. Narrow uncertain values at boundaries and keep internal code strongly typed.
4. Verify changed imports and referenced types resolve within the app.

## Output Contract

Return the TypeScript files changed, unsafe types removed or narrowed, runtime guards added, and verification performed.

## References

- `../../apps/halisco-landing/AGENTS.md` - Halisco runtime and implementation constraints.
