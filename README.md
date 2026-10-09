# Hono monorepo

A pnpm monorepo for a Hono server and shared application packages. Infrastructure includes reusable GitHub Actions for EC2, ECS/Fargate, and Cloudflare Containers deployments.

## Getting started

Install dependencies from the repository root:

```sh
pnpm install
```

For server setup, local development, and database migrations, follow the [server workspace guide](workspaces/server/README.md).

## Guides

- [Deployment](docs/guides/deployment.md): configure GitHub environments and choose a deployment provider.
- [Nginx](docs/guides/nginx.md): configure the optional EC2 reverse proxy and HTTPS.

Additional project guides belong in [`docs/guides/`](docs/guides/). The Bruno API collection is in [`docs/bruno/`](docs/bruno/).
