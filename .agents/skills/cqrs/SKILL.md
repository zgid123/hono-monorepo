---
name: cqrs
description: Alpha's CQRS guidance for TypeScript projects. Always use when creating, modifying, or reviewing application use cases, commands, command handlers, queries, query handlers, domain or integration events, buses, read/write separation, or wiring CQRS with @cqrsx/core. Enforces co-locating messages and handlers in the same file and explicit dispatch conventions.
---

# CQRS for TypeScript

## Purpose

Use CQRS to separate write use cases from read use cases when the separation makes behavior clearer. In TypeScript projects, prefer `@cqrsx/core` for CQRS primitives and wiring.

CQRS is not a reason to add ceremony by default. Use it when commands and queries have different responsibilities, dependencies, validation, permissions, transaction needs, or result shapes.

## Required Package

- Use `@cqrsx/core` as the default CQRS package for TypeScript projects.
- Do not add another CQRS framework unless the project already uses one or the user explicitly asks.
- The public API currently exports `Command`, `Query`, `Event`, `Cqrsx`, `ICommandHandler`, `IQueryHandler`, and `IEventHandler`.
- If the installed version differs from the version already known to the project, inspect `node_modules/@cqrsx/core/lib/index.d.mts` or `node_modules/@cqrsx/core/lib/index.d.cts` before using newer exports.

## `@cqrsx/core` Usage

Import primitives from `@cqrsx/core`:

```ts
import {
  Command,
  Cqrsx,
  Event,
  type ICommandHandler,
  type IEventHandler,
  type IQueryHandler,
  Query,
} from '@cqrsx/core';
```

Messages are class-based:

- Commands extend `Command`.
- Queries extend `Query<TResult>`.
- Events extend `Event`.
- Only define a constructor when the command, query, or event has attributes to assign. If a message has no attributes, omit the constructor instead of writing `constructor() { super(); }`.
- Handlers implement `exec(...)` and return a `Promise`.

Use `Cqrsx.register(MessageClass, handler)` to register handlers. Registration returns the same `Cqrsx` instance, so startup wiring can be chained.

Use `cqrsx.exec(new SomeCommand(...))` for commands and `cqrsx.exec(new SomeQuery(...))` for queries. Query result types are inferred from `Query<TResult>`.

Use `cqrsx.publish(new SomeEvent(...))` for events. Do not pass events to `exec`.

```ts
class CreateUserCommand extends Command {
  public readonly name: string;

  public constructor(name: string) {
    super();

    this.name = name;
  }
}

class GetUserNameQuery extends Query<string> {
  public readonly userId: string;

  public constructor(userId: string) {
    super();

    this.userId = userId;
  }
}

class UserCreatedEvent extends Event {
  public readonly userId: string;

  public constructor(userId: string) {
    super();

    this.userId = userId;
  }
}

class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  public async exec(command: CreateUserCommand): Promise<void> {
    // Orchestrate the write use case here.
  }
}

class GetUserNameQueryHandler
  implements IQueryHandler<GetUserNameQuery, string>
{
  public async exec(query: GetUserNameQuery): Promise<string> {
    return query.userId;
  }
}

class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
  public async exec(event: UserCreatedEvent): Promise<void> {
    // React to the event here.
  }
}

const cqrsx = new Cqrsx()
  .register(CreateUserCommand, new CreateUserCommandHandler())
  .register(GetUserNameQuery, new GetUserNameQueryHandler())
  .register(UserCreatedEvent, new UserCreatedEventHandler());

await cqrsx.exec(new CreateUserCommand('Alpha'));
const userName = await cqrsx.exec(new GetUserNameQuery('user-1'));
await cqrsx.publish(new UserCreatedEvent('user-1'));
```

For messages with no attributes, keep the class empty:

```ts
class RebuildSearchIndexCommand extends Command {}

class ListCurrentUserSessionsQuery extends Query<SessionDto[]> {}

class DailyDigestReadyEvent extends Event {}
```

Prefer object-shaped constructor parameters when a message has more than one field:

```ts
interface IArchiveUserCommandParams {
  readonly userId: string;
  readonly reason: string;
}

class ArchiveUserCommand extends Command {
  public readonly userId: string;
  public readonly reason: string;

  public constructor({ userId, reason }: IArchiveUserCommandParams) {
    super();

    this.userId = userId;
    this.reason = reason;
  }
}
```

Runtime behavior to account for:

- A command class has one handler. Registering another handler for the same command class logs a warning and keeps the first handler.
- A query class has one handler. Registering another handler for the same query class logs a warning and keeps the first handler.
- An event class can have multiple handlers. They run sequentially in registration order.
- Registering the same event handler instance twice for the same event class logs a warning and keeps one registration.
- `exec` throws when a command or query has no registered handler.
- `publish` resolves when an event has no registered handlers.
- `publish` rejects when a handler rejects and does not execute later handlers.
- `register` throws when the message class does not extend `Command`, `Query`, or `Event`.

## File Structure

Create one file per command, query, or event. Put the message class and its handler class or classes in the same file.

```txt
application/
  commands/
    CreateOrderCommand.ts      # CreateOrderCommand + CreateOrderCommandHandler
    CancelOrderCommand.ts      # CancelOrderCommand + CancelOrderCommandHandler
  queries/
    GetOrderQuery.ts           # GetOrderQuery + GetOrderQueryHandler
events/
  OrderCreatedEvent.ts         # OrderCreatedEvent + OrderCreatedEventHandler(s)
```

Do not split a single use case into separate `CreateOrderCommand.ts` and `CreateOrderCommandHandler.ts` files. The command/query/event and its handler belong together unless the existing project already has a stronger convention. If an event has multiple local handlers, keep those handlers in the event file while it remains readable; extract only when the file becomes genuinely hard to maintain.

## When To Use CQRS

Use CQRS when:

- A use case changes state and should be modeled as an explicit command.
- A read path has its own data shape, filtering, authorization, caching, or projection needs.
- The application layer needs consistent dispatch, handler registration, middleware, logging, or transaction wrapping.
- Commands and queries make ownership boundaries clearer inside a bounded context.

Avoid CQRS when:

- The feature is simple CRUD and a direct service or repository call is clearer.
- A query would only wrap a single repository method without adding application meaning.
- The command/query split would introduce files, buses, or handlers that do not protect any current behavior.

## Layering

Follow the DDD skill's dependency direction:

```txt
adapters -> application -> domain
infrastructure -> domain/application contracts
```

- Domain objects own business rules and invariants.
- Commands and queries live in the application layer and orchestrate use cases.
- Handlers may load entities, call domain behavior, persist changes, publish events, and return application results.
- Adapters translate HTTP, GraphQL, gRPC, queues, or CLI input into commands and queries.
- Infrastructure implements repositories, projections, persistence, queues, and other technical concerns.

## Command Rules

- Use commands for state-changing intent.
- Name command files and exported command types/classes with the `Command` suffix, for example `CreateOrderCommand` or `CancelSubscriptionCommand`.
- Put `CreateOrderCommand` and `CreateOrderCommandHandler` together in `CreateOrderCommand.ts`.
- Prefer imperative business names: `CreateOrderCommand`, `CancelOrderCommand`, `MarkInvoiceAsPaidCommand`.
- Implement handlers with `ICommandHandler<TCommand, TResult>` when a command must return a value; otherwise use the default `void` result.
- Keep command input explicit and serializable unless the existing project has a different convention.
- Validate transport shape in adapters; validate business rules in domain/application code.
- Put transaction boundaries around command handling when persistence consistency matters.
- A command handler may return a result when the use case needs it, but avoid returning full persistence models by default.

## Query Rules

- Use queries for read-only use cases.
- Name query files and exported query types/classes with the `Query` suffix, for example `GetOrderQuery` or `ListInvoicesQuery`.
- Put `GetOrderQuery` and `GetOrderQueryHandler` together in `GetOrderQuery.ts`.
- Extend `Query<TResult>` so `cqrsx.exec(query)` returns `Promise<TResult>`.
- Queries must not mutate domain state.
- Return read models, DTOs, or explicit result shapes that match the caller's needs.
- Keep projection-specific SQL, ORM selection, or cache lookup in infrastructure or a query-side repository when that is the project convention.

## Handler Rules

- Keep handlers small and focused on one use case.
- Inject dependencies explicitly; do not import concrete infrastructure singletons inside handlers unless the project already wires dependencies that way.
- Use repository contracts for domain persistence and concrete infrastructure only at the composition root.
- Prefer in-memory fakes over mocks for handler tests.
- Do not put transport concerns such as status codes, headers, request objects, or response objects in handlers.

## Bus and Wiring Rules

- Create CQRS bus setup at the application composition boundary, not inside domain code.
- Register handlers once during app startup, worker startup, or test setup.
- Keep command and query registration explicit enough that missing handlers are easy to spot.
- Add middleware only for current needs such as logging, authorization, validation, transactions, or observability.
- Do not create global mutable buses in reusable domain packages.

## Events

- Use domain or integration events only when another part of the system currently reacts to something that happened.
- Name events in past tense, for example `OrderCreatedEvent` or `InvoicePaidEvent`.
- Put `OrderCreatedEvent` and its local handler class or classes together in `OrderCreatedEvent.ts`.
- Publish events with `cqrsx.publish(event)`, not `cqrsx.exec(event)`.
- Keep event publishing after the command has successfully produced the state change, and coordinate with the transaction strategy.
- Do not add event sourcing unless the user asks or the project already uses it.

## Testing

- Test domain behavior directly without CQRS wiring.
- Test command handlers with in-memory repository fakes and behavior assertions.
- Test query handlers against realistic fakes or test infrastructure depending on the read path risk.
- Test adapters with end-to-end tests; do not unit test controllers by mocking CQRS internals.
- Add one CQRS wiring test only when handler registration is non-trivial or easy to break.

## Decision Checklist

Before adding a command, query, handler, or bus abstraction, verify:

- What behavior or boundary does this make clearer?
- Is this a real write use case or read use case?
- Does the project already have a simpler pattern for this case?
- Are domain rules still in the domain instead of the handler?
- Does the `@cqrsx/core` wiring use `register`, `exec`, and `publish` according to the message type?
