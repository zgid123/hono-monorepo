# TypeScript Monorepo Domains

For TypeScript monorepos, keep the domain in a local package so it can stay framework-free and be reused by apps, workers, tests, and adapters.

Use this layout when creating a new TypeScript bounded context:

```txt
packages/
  @domain/
    <business-domain>/
      src/
        entities/
        errors/
        services/
        repositories/
        index.ts
      package.json

apps/
  <app-name>/
    src/
      modules/
        <bounded-context>/
          application/
            commands/
            queries/
          infrastructure/
            drizzle/
              repositories/
            mongoose/
              repositories/
            redis/
              repositories/
            security/
          adapters/
            restful/
              hono/
                internal/
                public/
                  v1/
                  v2/
            graphql/
            grpc/
```

Rules for TypeScript monorepos:

- The domain package must not import from apps, adapters, infrastructure, ORM libraries, HTTP frameworks, GraphQL libraries, or environment configuration.
- Export only intentional domain APIs from the domain package entrypoint.
- Keep repository contracts in the domain package when they are part of the domain boundary.
- Put concrete repository implementations in the app or infrastructure package that owns the persistence technology instance.
- Application commands and queries may depend on the domain package, repository contracts, and `@cqrsx/core`.
- Adapters call application commands and queries; they should not call ORM repositories directly.
- Infrastructure implements domain/application contracts and maps ORM records to domain objects.

## Referencing the Domain Package

Reference the domain through the workspace package name. In a monorepo, a workspace package should be consumed like a normal package after it is declared as a workspace dependency.

Use a package name and folder path that match the repo convention:

```txt
packages/
  @domain/
    orders/
      package.json
      src/
        index.ts
```

```json
{
  "name": "@domain/orders",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

Then declare it as a workspace dependency from the app or package that needs it:

```json
{
  "dependencies": {
    "@domain/orders": "workspace:*"
  }
}
```

Application, infrastructure, and adapter code should import from the package entrypoint:

```ts
import { Order, OrderRepository, OrderCannotBeCancelledError } from "@domain/orders";
```

Do not import domain code through relative paths into `packages/`, and do not add `tsconfig` path aliases to fake package imports. The package manager workspace should link `@domain/orders` like any other dependency.

Do not make the domain package depend on the app to solve wiring. Wiring belongs in the app layer:

```ts
import { Cqrsx } from '@cqrsx/core';
import {
  CancelOrderCommand,
  CancelOrderCommandHandler,
} from './application/commands/CancelOrderCommand';
import { OrderRepository } from './infrastructure/drizzle/repositories/OrderRepository';

const orderRepository = new OrderRepository(drizzle);
const cqrsx = new Cqrsx().register(
  CancelOrderCommand,
  new CancelOrderCommandHandler(orderRepository),
);
```

For other languages, preserve the same dependency rules even if the physical layout differs. Use the language's normal module/package conventions instead of forcing the TypeScript monorepo layout.
