---
name: domain-driven-design
description: Alpha's Domain-Driven Design guidance. Always use when modeling business domains, defining bounded contexts, entities (*Entity.ts), value objects (*ValueObject.ts), domain errors (*Error.ts), repository contracts (I*Repository.ts), domain services, application commands/queries, adapters, or TypeScript monorepo domain packages. Enforces business rule protection, clean layer separation, and dependency direction.
---

# Domain-Driven Design

## Purpose

Use Domain-Driven Design to model real business behavior, protect business rules, and make code reflect the language of the domain.

DDD is not a reason to add layers by default. Apply it when the domain has meaningful rules, workflows, invariants, or language that should be preserved in code.

## When To Use DDD

Use DDD when:

- Business rules are complex or change often.
- Domain users use specific language that should appear in code.
- Data validity depends on behavior, not only database constraints.
- Workflows have states, transitions, permissions, or invariants.
- Multiple modules need clear ownership boundaries.

Avoid heavy DDD when:

- The feature is mostly CRUD.
- The domain has no meaningful behavior yet.
- A simple service, schema, or transaction script is clearer.
- The abstraction would hide intent instead of clarifying it.

## Core Principles

- Model business concepts, not database tables.
- Put invariants close to the data they protect.
- Use domain language in names.
- Keep entities responsible for their own valid state.
- Use domain services only for domain behavior that does not fit an entity or value object.
- Use repositories to load and persist aggregates, not to hide business decisions.
- Keep mappers at boundaries between layers.
- Prefer explicit state transitions over scattered conditionals.
- In TypeScript projects, create application commands and queries with `@cqrsx/core`; read `skills/cqrs/SKILL.md` before implementing them.

## Naming

Prefer names that describe business actions:

```ts
order.cancel(reason);
invoice.markAsPaid(paymentId);
subscription.renew(period);
```

Avoid vague technical names:

```ts
updateStatus();
processData();
handleRecord();
```

## Decision Checklist

Before introducing a DDD pattern, ask:

- What business rule does this protect?
- What invalid state does this prevent?
- Is there domain language this makes clearer?
- Is this simpler than a plain function or service?
- Will this abstraction survive the next likely change?

If the answers are weak, keep the design simpler.

## Reference Guides

- [File Naming](./references/naming.md) - naming rules for entities, repository contracts, commands, queries, and infrastructure implementations.
- [Logical Structure and Layers](./references/structure.md) - bounded context layout, layer responsibilities, adapters, infrastructure, and dependency direction.
- [Large Monolith Structure](./references/large-monolith.md) - `modules/<domain>` layout with root-level adapters and infrastructure for projects with many business domains.
- [TypeScript Monorepo Domains](./references/typescript-monorepo.md) - local domain packages, package exports, workspace dependencies, and app-layer wiring.
- [Testing Domain Behavior](./references/testing.md) - focused tests for transitions, invariants, domain errors, value objects, and business edge cases.
- [CQRS](../cqrs/SKILL.md) - required TypeScript command/query/event primitives and handler co-location rules using `@cqrsx/core`.
