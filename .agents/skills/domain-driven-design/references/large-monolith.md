# Large Monolith Structure

For a large monolith with many business domains, add `modules/` next to root `adapters/` and `infrastructure/`. Each module is a business domain, such as `auth`, `quiz`, or `product`, and owns its own domain-specific layers.

Use this layout for large monoliths:

```txt
src/
  adapters/
    restful/
      hono/
        internal/
        public/
          v1/
          v2/
    graphql/
    grpc/
  infrastructure/
    drizzle/
      schema/
      migrations/
      seed/
      instance.ts
    mongoose/
      schemas/
      instance.ts
    redis/
      instance.ts
    config/
  modules/
    auth/
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
    quiz/
      domain/
      application/
      infrastructure/
      adapters/
    product/
      domain/
      application/
      infrastructure/
      adapters/
```

Root `adapters/` are app-level transport composition. They define the framework setup, server registration, common middleware, routing root, GraphQL server, or gRPC server, then import and mount the domain-specific endpoints from `modules/<domain>/adapters/`.

Domain modules own their business endpoints. For example, `modules/auth/adapters/restful/hono/` defines the auth routes, while root `adapters/restful/hono/` imports and mounts those routes.

For public APIs, keep version-specific endpoint definitions inside each domain module adapter:

```txt
modules/
  auth/
    adapters/
      restful/
        hono/
          public/
            v1/
              routes.ts
            v2/
              routes.ts
  product/
    adapters/
      restful/
        hono/
          public/
            v1/
              routes.ts
            v2/
              routes.ts
```

Internal endpoints do not need versioning by default:

```txt
modules/
  auth/
    adapters/
      restful/
        hono/
          internal/
            routes.ts
```

Root adapters compose endpoint visibility and versions at the application boundary. For example, root `adapters/restful/hono/public/v1/` mounts the public `v1` routes from each module, while root `adapters/restful/hono/internal/` mounts internal routes from each module.

Root `infrastructure/` owns shared technical setup: config, database clients, shared schemas, migrations, seeds, connections, and process-level wiring. Do not put business-domain repository implementations in root infrastructure.

Domain module `infrastructure/` owns business-specific implementations, especially repositories. For example, `modules/product/infrastructure/drizzle/repositories/` contains Drizzle repositories for the product domain, while `modules/auth/infrastructure/redis/repositories/` contains Redis repositories for auth sessions or tokens.
