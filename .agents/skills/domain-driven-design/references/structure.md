# Logical Structure and Layers

Follow the existing project structure first. DDD defines logical boundaries; the physical structure can vary by language, framework, and package manager.

Use these logical layers unless a project has a stronger convention:

```txt
<bounded-context>/
  domain/
    entities/
    errors/
    services/
    repositories/
  application/
    commands/
    queries/
  infrastructure/
    drizzle/
    mongoose/
    redis/
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

## Domain

The domain layer contains business concepts and rules. It should not depend on frameworks, databases, HTTP, GraphQL, gRPC, queues, or environment configuration.

Put these in `domain/`:

- `entities/` - entities and aggregate roots with identity and behavior.
- `errors/` - domain-specific errors for invalid business operations.
- `services/` - domain services for business behavior that does not naturally belong to one entity.
- `repositories/` - repository contracts used to load and persist domain objects.

## Application

The application layer orchestrates use cases. It coordinates domain objects, repositories, and transactions, but it should not own core business rules.

Put these in `application/`:

- `commands/` - write use cases that change system state.
- `queries/` - read use cases that return data without changing system state.

Application code may call domain behavior, repositories, and infrastructure ports. Keep it focused on orchestration: validate input shape, load domain objects, execute behavior, persist results, and return output.

In TypeScript projects, commands and queries must use `@cqrsx/core`. Command classes extend `Command`, query classes extend `Query<TResult>`, and handlers implement `ICommandHandler` or `IQueryHandler`. Keep each command/query and its handler in the same file, following `skills/cqrs/SKILL.md`.

## Infrastructure

The infrastructure layer contains technical implementations.

Put these in `infrastructure/`:

- `<technology>/` - concrete database, ORM, ODM, cache, queue, or external service setup, such as `drizzle/`, `mongoose/`, `redis/`, `prisma/`, `kysely/`, `stripe/`, or `s3/`.
- `security/` - technical security implementations such as password hashing, JWT signing and verification, token generation, encryption, and key management.

Infrastructure may depend on database clients, ORM libraries, queues, external APIs, and framework adapters. It is also the right place for implementations that depend on technical libraries, such as `bcrypt`, `argon2`, `jsonwebtoken`, `jose`, KMS clients, or crypto APIs.

Organize infrastructure by concrete technology when a bounded context uses multiple persistence or technical clients. Put technology-specific models, schemas, documents, migrations, connection config, and low-level client setup inside the matching folder:

```txt
infrastructure/
  drizzle/
    schema/
    migrations/
    instance.ts
    repositories/
      UserRepository.ts
  mongoose/
    documents/
    schemas/
    instance.ts
    repositories/
      SessionRepository.ts
  redis/
    instance.ts
    keys.ts
    repositories/
      TokenRepository.ts
```

Avoid a generic `orm/` folder when the project uses multiple persistence technologies. Name the folder after the actual tool or service so ownership stays obvious.

Put concrete repository implementations under the technology they use. A repository implementation usually needs to know which persistence engine, schema, client, and query API it targets, so keeping it next to that technology makes the dependency explicit.

Keep repository contracts in `domain/repositories/` when they are part of the domain boundary. Infrastructure repositories implement those contracts from inside their concrete technology folder.

Keep business meaning out of infrastructure. For example, the rule "a suspended user cannot log in" belongs in domain or application code, while the implementation of `hashPassword`, `verifyPassword`, `signAccessToken`, or `verifyAccessToken` belongs in infrastructure.

Domain code must not depend on infrastructure code.

## Adapters

The adapters layer contains delivery mechanisms and protocol-specific entry points.

Put these in `adapters/`:

- `restful/` - REST controllers, routes, request/response mapping.
- `graphql/` - resolvers, GraphQL types, schema integration.
- `grpc/` - gRPC handlers, service definitions, transport mapping.

Adapters should translate transport-specific input into application commands or queries. They should not contain business rules.

When a transport can be implemented by multiple frameworks or libraries, add a framework-specific subfolder under the transport:

```txt
adapters/
  restful/
    hono/
      internal/
      public/
        v1/
        v2/
    express/
      internal/
      public/
        v1/
        v2/
    fastify/
  graphql/
    yoga/
    apollo/
  grpc/
    nice-grpc/
```

Use framework subfolders only when they clarify ownership or when multiple implementations coexist. If a project has one obvious framework convention, keep the adapter layout simple and follow that convention.

Separate public and internal endpoints inside adapters when both exist. Public endpoints are external contracts and must be versioned. Internal endpoints are private application contracts and usually do not need versioning:

```txt
adapters/
  restful/
    hono/
      internal/
        routes.ts
        request.ts
        response.ts
      public/
        v1/
          routes.ts
          request.ts
          response.ts
        v2/
          routes.ts
          request.ts
          response.ts
  graphql/
    yoga/
      internal/
        resolvers.ts
        types.ts
      public/
        v1/
          resolvers.ts
          types.ts
        v2/
          resolvers.ts
          types.ts
  grpc/
    nice-grpc/
      internal/
        handlers.ts
      public/
        v1/
          handlers.ts
        v2/
          handlers.ts
```

Put API versioning inside adapters because versioning is usually a delivery contract concern. Versioned routes, controllers, resolvers, handlers, request DTOs, response DTOs, and transport mappers belong near the transport/framework implementation.

Keep domain and application code version-neutral by default. A new API version should usually map to the same application commands and queries through different adapter DTOs or mappers. Create version-specific application behavior only when the use case itself changes, not just because the HTTP, GraphQL, or gRPC contract changed.

## Dependency Direction

Prefer this dependency direction:

```txt
adapters
  -> application
    -> domain

infrastructure
  -> domain/application contracts
```

Keep dependencies pointing inward toward the domain. Use interfaces or contracts when application code needs persistence or external capabilities.
