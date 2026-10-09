# Server

Use pnpm, Node.js, PostgreSQL 18, and Make. PostgreSQL 18 provides the `uuidv7()` function used by the migrations. Run the following commands from the repository root.

```sh
pnpm install
```

Configure `workspaces/server/.env` for your local database. The server loads this file when started from the server workspace. At minimum, set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `ADMIN_EMAIL`, and `BETTER_AUTH_SECRET`. Set `DB_HOST` and `DB_PORT` if PostgreSQL is not available on `localhost:5432`. `PORT` defaults to `3000`, and `detect-port` selects the next free port when needed. `ADMIN_PASSWORD` is optional; setting it creates the initial admin account.

For development, apply migrations and create the initial admin account before starting the server. Run the migration command again after adding migrations. The workspace packages resolve to their TypeScript files and do not need to be built:

```sh
pnpm --filter server db:migrate
pnpm --filter server dev
```

For a local production run, build the server and all of its workspace dependencies first. The server build copies migration files with Make. Apply migrations before starting the server:

```sh
pnpm --filter server... -r run build
pnpm --filter server db:migrate:prod
pnpm --filter server start
```

The production condition resolves workspace packages to compiled JavaScript. To build and run the production image from the repository root:

```sh
docker build -f infrastructures/server/Dockerfile -t hono-server .
```

Supply the same database and authentication environment variables when running the image. The container listens on port `3000` by default.

The [deployment guide](../../docs/guides/deployment.md) explains the `Deploy server` workflow, reusable Docker build action, EC2 setup, ECS/Fargate and Cloudflare Containers release actions, and migrations. See the [Nginx guide](../../docs/guides/nginx.md) for the optional reverse proxy.
