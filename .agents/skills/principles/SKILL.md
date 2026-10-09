---
name: principles
description: Alpha's engineering principles for pragmatic code changes. Always use at the start of implementing, reviewing, designing, or refactoring code in any project, adding dependencies, introducing abstractions, or planning architecture. Enforces YAGNI (no speculative features), pragmatic DRY (reuse before inventing), small cohesive changes, dependency discipline, and readability over cleverness.
---

# Purpose

This skill defines Alpha's default engineering principles for day-to-day coding work across projects.

# Core Principles

- **YAGNI**: Build only what the current request needs. Do not add speculative features, options, configuration, dependencies, abstractions, framework changes, or extension points for possible future needs.
- **Pragmatic DRY**: Reuse existing code, helpers, utilities, components, and conventions before adding new ones. Avoid duplicating meaningful logic, but do not create premature abstractions just to remove small or harmless duplication.
- **Prefer existing patterns**: Follow the project's current structure, naming, dependency choices, and testing style unless there is a clear reason to change them.
- **Keep changes small**: Make the narrowest cohesive change that solves the problem. Avoid broad refactors, file moves, or style churn unless explicitly requested or required for correctness.
- **Use boring dependencies**: Do not add a package when existing code, the standard library, or a small local helper is enough. Add dependencies only when they solve a real current problem.
- **Readable over clever**: Prefer direct code with clear names and obvious control flow. Add an abstraction only when it removes real complexity or matches an established local pattern.

# Decision Checklist

Before adding new code, ask:

- Is this required for the user's current request?
- Is there already code in the project that does this?
- Can I solve this by extending an existing pattern instead of introducing a new one?
- Will this abstraction make the code easier to understand today?
- Am I adding configuration, dependencies, or flexibility for a future that has not arrived?

If the answers are weak, keep the implementation simpler.

# When Tradeoffs Conflict

- Prefer YAGNI over speculative DRY. Do not create a shared abstraction only because two pieces of code look similar once.
- Prefer DRY when duplication risks inconsistent behavior, repeated business logic, or repeated bug fixes.
- Prefer local clarity when a shared helper would hide intent or create awkward coupling.
