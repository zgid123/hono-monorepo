---
name: react
description: Guidelines for writing consistent, type-safe React components in Alpha's projects. Always use when creating, editing, or refactoring React (.tsx, .jsx) components, custom hooks, widgets, props interfaces (e.g. IFooProps), JSX return types, feature-based slices (src/features), or shadcn/ui wrappers (core/ vs shadcn-ui/). Enforces function declarations, named exports, explicit return types, and TypeScript skill compliance.
---

# Purpose

This skill defines how to write and structure React components so that code is type-safe, readable, and consistent across Alpha's projects. All rules here extend and respect the TypeScript skill — read `skills/typescript/SKILL.md` and its references first.

# General Principles

- **Extend the TypeScript skill**: read `skills/typescript/SKILL.md` and the references that apply to the component or hook. Its rules apply to TypeScript React files unless explicitly overridden here.
- **Feature-based structure**: organise code by domain area under `src/features/<feature>/`. Each feature contains four sub-folders — `components/` (pure presentational), `hooks/` (shared hooks used by two or more consumers), `utils/` (pure helpers), and `widgets/` (smart containers that wire hooks into components). A hook used by only one component or widget is co-located with that file, not placed in `hooks/`. Shared components used across features live in `src/components/`.
- **Function declarations for components**: always define components with the `function` keyword, never as arrow function constants assigned to a variable.
- **Named exports only**: always export components with `export function`. `export default` is only allowed in framework router files that require it (Next.js page/layout files, TanStack Start route files).
- **Explicit JSX return type**: every component must declare at least `JSX.Element` as its return type. Use `JSX.Element | null` when the component can render nothing.
- **Named imports only**: import React APIs by name. Never use `import * as React from 'react'` or rely on a global React namespace.
- **Props interface naming**: the props interface for a component named `Foo` must be named `IFooProps`.

# Reference Guides

- [Structure](./references/structure.md) — feature-based folder layout, shared components, feature barrels, and cross-feature rules.
- [Components](./references/components.md) — function declarations, return types, props interfaces, and JSX conventions.
- [Imports](./references/imports.md) — how to import React, hooks, and third-party libraries.
- [shadcn/ui](./references/shadcn-ui.md) — alias configuration, the `shadcn-ui/` vs `core/` split, and design system wrapper rules.
