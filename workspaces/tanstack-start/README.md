# TanStack Start

A TanStack Start starter with email and password authentication, Paraglide i18n, TanStack Query, and Sentry.

## Development

From the repository root, run:

```sh
pnpm --filter tanstack-start dev
```

Set `VITE_BETTER_AUTH_URL` in `.env.local` to the server's Better Auth endpoint (by default, `http://localhost:3000/api/v1/auth`). Start the server and apply its database migrations before signing in. The server must include the TanStack Start origin (`http://localhost:3004` by default) in `ALLOWED_ORIGINS`.

Set `VITE_API` to the server API origin (by default, `http://localhost:3000`). Signed-in users can open `/internal/users` to view the paginated users table. TanStack Start forwards the session cookie to the API when fetching users on the server.

## Internationalization

Shared messages and locale definitions live in `packages/@config/i18n`. TanStack Start messages live in `src/integrations/i18n`. Vite merges the shared and app messages before Paraglide compiles them into `src/integrations/i18n/paraglide`.

The shared i18n config defines Vietnamese as the base locale and supports English. English URLs use the `/en` prefix.
