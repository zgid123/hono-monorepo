# TanStack Start

A TanStack Start starter with email and password authentication, Paraglide i18n, TanStack Query, and Sentry.

## Development

Set the browser auth URL in `.env.local`:

```dotenv
VITE_BETTER_AUTH_URL=http://localhost:3000/api/v1/auth
```

Supply the server URLs through the process environment when starting development:

```sh
API_URL=http://localhost:3000 BETTER_AUTH_URL=http://localhost:3000/api/v1/auth pnpm --filter tanstack-start dev
```

`API_URL` is the server-only Hono origin used by Axios for server-side API requests. `authClient` initializes its URL from `BETTER_AUTH_URL` on the server and `VITE_BETTER_AUTH_URL` in the browser. Start Hono and apply its database migrations before signing in. TanStack Start runs at `http://localhost:3001`; include that origin in Hono's `ALLOWED_ORIGINS` so Better Auth accepts browser requests from the frontend.

Session loading follows the [Better Auth TanStack Start guide](https://better-auth.com/docs/integrations/tanstack): the root route calls a session server function in `beforeLoad`, protected routes check that context, and components read it through `useAuthSession()`. Login and signup navigate to the home route, reloading the session through `beforeLoad`. Logout clears cached user data and navigates to the auth route, reloading the session through `beforeLoad`. There is no manual hydration of Better Auth's client store. The guide's `auth.api.getSession()` example assumes an auth instance in the Start process; this repository's server function calls `authClient.getSession()` over HTTP because Better Auth runs in Hono.

During local development, the browser calls Hono directly. Both applications use the `localhost` hostname, so their host-only cookies are available across ports. SSR forwards the incoming cookie to Hono through `authClient.getSession()` and `@alphacifer/axios`. The session check forwards returned `Set-Cookie` headers to the frontend response.

For Hono on Cloudflare and TanStack Start on Vercel, configure an external rewrite in the existing `vercel.json`. Replace the example destination below with your deployed Hono endpoint:

```json
{
  "rewrites": [
    {
      "source": "/api/v1/auth/:path*",
      "destination": "https://your-hono.workers.dev/api/v1/auth/:path*"
    }
  ]
}
```

Set `VITE_BETTER_AUTH_URL` to `https://your-frontend.vercel.app/api/v1/auth` before building. Vercel forwards browser auth requests to Hono, keeping host-only cookies on the frontend host. In the Vercel server environment, set `API_URL` to Hono's origin and `BETTER_AUTH_URL` to Hono's full auth endpoint; SSR calls Hono directly. In Hono's environment, set `BETTER_AUTH_URL` to the public frontend origin and include that origin in `ALLOWED_ORIGINS`. Existing cookies on the API hostname require a new login after switching to the frontend auth endpoint. There is no application-level proxy in TanStack Start.

Build with `pnpm --filter tanstack-start build`, check types with `pnpm --filter tanstack-start exec tsc --noEmit`, then run `pnpm --filter tanstack-start start`. Turbo caches `.output`, which contains the production server.

## Internationalization

Shared messages and locale definitions live in `packages/@config/i18n`. TanStack Start messages live in `src/integrations/i18n`. Vite merges the shared and app messages before Paraglide compiles them into `src/integrations/i18n/paraglide`.

The shared i18n config defines Vietnamese as the base locale and supports English. English URLs use the `/en` prefix.
