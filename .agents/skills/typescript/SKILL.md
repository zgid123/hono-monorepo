---
name: typescript
description: Guidelines for writing type-safe, readable TypeScript for Alpha's projects. Always use when creating, editing, or refactoring any TypeScript (.ts) files, types (T prefix), interfaces (I prefix), function parameter objects, path aliases (#/ imports), #private class members, tsconfig extending @alphacifer/tsconfig, Biome lint/format configurations, or installing dependencies in a TypeScript project. Enforces strict type safety, explicit return types on public APIs, no loose any, and small focused modules.
---

# Purpose

This skill defines how to write and structure TypeScript so that code is type-safe, readable, and consistent across Alpha's projects.

# General Principles

- **`@alphacifer/tsconfig`** is **required**. Every project must extend it; do not override or loosen options—fix code instead unless the project documents an exception.
- **`@alphacifer/biome`** is **required when Biome is used**. If a project has Biome configured, it must extend Alpha's Biome config instead of maintaining unrelated local lint or format rules.
- **Prefer types over `any`**: Use precise types, generics, and inference; use `unknown` and narrow when the type is dynamic.
- **Explicit over implicit**: Prefer explicit return types on public APIs and exports; rely on inference for locals and private helpers.
- **Small, focused modules**: Prefer small files and single responsibility; use barrel exports only when they clearly simplify the public API.
- **Public parameter objects**: Exported functions and public instance methods take one named interface parameter object. Destructure its first-level properties in the function signature when using individual properties; do not move that destructuring into the body. Keep the object intact only when the whole object must be passed onward. Keep private helpers simple.

# Reference Guides

- [Types and Interfaces](./references/types.md) - object shapes, unions, readonly values, branded types, and nullable modeling.
- [Modules and Imports](./references/imports.md) - ES modules, relative imports, and path aliases.
- [Style and Formatting](./references/style.md) - naming, enum alternatives, guard clauses, block braces, and object formatting.
- [Testing and Tooling](./references/tooling.md) - tsconfig, lint/format expectations, and testing conventions.
- [Dependencies](./references/dependencies.md) - exact versions, Alpha package exceptions, and monorepo root dependencies.
