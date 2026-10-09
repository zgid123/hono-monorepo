# Agent guide

## Project map

This is a pnpm 11 and Turbo monorepo. Run commands from the repository root unless a guide says otherwise.

- `workspaces/server`: Hono API, Better Auth, CQRS application handlers, Drizzle persistence, and migrations.
- `packages/@domain/*`: domain entities, errors, services, and repository contracts.
- `packages/@contracts/*`: API schemas and view models shared across applications.
- `packages/@node/*`: reusable server infrastructure.
- `packages/@react/design-system`: application components and Storybook stories; `packages/@react/shadcn-ui`: base UI components.
- `packages/@core/utils` and `packages/@config/tailwind`: shared utilities and styling.
- `infrastructures/server`, `.github`, and `docs/guides`: deployment assets, workflows, and operational guides.

## Working conventions

- Read the relevant `.agents/skills/*/SKILL.md` before changing code. Always start with `principles`; use `typescript` for TypeScript, `react` for React, `domain-driven-design` for domain work, `cqrs` for application messages and handlers, and `testing` when changing tests. Use the Better Auth skills for authentication changes.
- Follow nearby code and package boundaries. Keep business rules in the domain, orchestration in application handlers, and HTTP/database details in adapters or infrastructure. Reuse existing schemas and components before adding new ones.
- Keep changes scoped. Do not modify generated output such as `lib/`, `dist/`, `coverage/`, or `storybook-static/` by hand.
- Treat `.env` files and certificate material as secrets. Do not print, commit, or copy their values into examples or logs.
- Preserve unrelated work in the working tree. Check `git status --short` before editing.

## Common commands

```sh
pnpm install
pnpm --filter server dev
pnpm build
pnpm test
pnpm storybook
```

For server development, use PostgreSQL 18, configure `workspaces/server/.env`, and run `pnpm --filter server db:migrate` before starting the API. See `workspaces/server/README.md` for the required variables and production commands. Server end-to-end tests require a test database; the CI setup is in `.github/workflows/server-test.yml`.

Run the narrowest relevant verification for a change. Package-level tests use `pnpm --filter <package> test` where the package provides that script; the root `pnpm test` runs the Vitest projects with coverage. Use `pnpm build` for cross-package type and build checks. Formatting and linting use Biome (`pnpm exec biome check <paths>`); the pre-commit hook formats staged code.

## Further references

- `README.md` for repository setup and links.
- `workspaces/server/README.md` for local server setup and migrations.
- `docs/guides/deployment.md` and `docs/guides/nginx.md` for deployment.
- `docs/bruno/` for API request examples.
