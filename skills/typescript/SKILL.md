---
name: typescript
description: "Trigger: TypeScript, .ts, .tsx, types, interfaces, generics, const maps, type guards, removing any, tightening unknown. Apply strict TypeScript patterns when implementing or refactoring typed code."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.1-ah.2"
  scope: [halisco-landing]
  auto_invoke:
    - "Implementing or refactoring TypeScript in .ts/.tsx files"
    - "Tightening types, interfaces, generics, or const maps"
    - "Removing any, narrowing unknown, or adding type guards"
    - "Defining API response or contract types"
---

## Activation Contract

Load this skill when writing or refactoring TypeScript types, interfaces, generics, constant maps, type guards, or imports in any `.ts` or `.tsx` file.

## Hard Rules

- Model closed sets of values with a const object plus a derived type; never write a direct string-literal union.
- Keep interfaces and type aliases flat: one level of depth. Every nested object gets a dedicated named type or interface; reuse it when one already exists. Never inline a nested object type.
- The flat rule applies equally to `type` aliases and `interface` declarations, and to API response and contract types.
- Never use `any`. Use `unknown` and narrow it, or use generics.
- Use built-in utility types instead of re-declaring derived shapes.
- Validate unknown values with type guards that include null checks.
- Use `import type` (or inline `type` specifiers) for type-only imports.
- Use the app's configured path aliases for cross-directory imports and follow the app's module resolution for relative imports (for example, NodeNext requires `.js` specifiers).

## Const Types Pattern (REQUIRED)

```typescript
// ✅ ALWAYS: Create const object first, then extract type
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

// ❌ NEVER: Direct union types
type Status = "active" | "inactive" | "pending";
```

**Why?** Single source of truth, runtime values, autocomplete, easier refactoring.

## Flat Interfaces (REQUIRED)

Applies to `interface` and `type` alike, and to API response and contract types.

```typescript
// ✅ ALWAYS: One level depth, nested objects → dedicated interface
interface UserAddress {
  street: string;
  city: string;
}

interface User {
  id: string;
  name: string;
  address: UserAddress; // Reference, not inline
}

interface Admin extends User {
  permissions: string[];
}

// ❌ NEVER: Inline nested objects
interface User {
  address: { street: string; city: string }; // NO!
}

// ❌ NEVER: Inline nested objects in type aliases or response types either
type UserResponse = {
  data: { id: string; address: { city: string } }; // NO!
};
```

## Never Use `any`

```typescript
// ✅ Use unknown for truly unknown types
function parse(input: unknown): User {
  if (isUser(input)) return input;
  throw new Error("Invalid input");
}

// ✅ Use generics for flexible types
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// ❌ NEVER
function parse(input: any): any {}
```

## Utility Types

```typescript
Pick<User, "id" | "name">; // Select fields
Omit<User, "id">; // Exclude fields
Partial<User>; // All optional
Required<User>; // All required
Readonly<User>; // All readonly
Record<string, User>; // Object type
Extract<Union, "a" | "b">; // Extract from union
Exclude<Union, "a">; // Exclude from union
NonNullable<T | null>; // Remove null/undefined
ReturnType<typeof fn>; // Function return type
Parameters<typeof fn>; // Function params tuple
```

## Type Guards

```typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}
```

## Import Types

Use the app's configured path aliases for imports that cross directories; use relative paths only within the same directory or module. Follow the app's module resolution for relative specifiers (for example, NodeNext requires `.js` extensions).

```typescript
import type { User } from "./types";
import { createUser, type Config } from "./utils";
```
