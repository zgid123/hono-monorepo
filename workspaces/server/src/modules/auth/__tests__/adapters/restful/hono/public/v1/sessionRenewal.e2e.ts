import { eq } from '@alphacifer/drizzle/core';

import { createApp, type TApp } from '#/adapters/restful/hono';
import { drizzle } from '#/infrastructure/drizzle/instance';
import { sessions } from '#/modules/auth/infrastructure/drizzle/schemas/sessions';
import { users } from '#/modules/auth/infrastructure/drizzle/schemas/users';

interface ISignUpResponse {
  readonly token: string;
  readonly user: {
    readonly id: string;
  };
}

interface IAuthenticatedSession {
  readonly token: string;
  readonly cookie: string;
}

const DAY_MS = 86_400_000;
const SESSION_COOKIE_PREFIX = 'hono-monorepo.session_token=';

describe('Session renewal', () => {
  let app: TApp;

  beforeAll(() => {
    app = createApp();
  });

  async function createSession(): Promise<IAuthenticatedSession> {
    const response = await app.request('/api/v1/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Session Renewal User',
        email: 'session-renewal@example.test',
        password: 'ChangeMe123!',
      }),
    });

    expect(response.status).toBe(200);

    const { token, user } = (await response.json()) as ISignUpResponse;

    await drizzle
      .update(users)
      .set({
        role: 'admin',
      })
      .where(eq(users.id, user.id));

    const cookie = response.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ');

    expect(cookie).toContain(SESSION_COOKIE_PREFIX);

    return {
      token,
      cookie,
    };
  }

  async function ageSession(token: string): Promise<Date> {
    const expiresAt = new Date(Date.now() + 5 * DAY_MS);
    const updatedAt = new Date(Date.now() - 2 * DAY_MS);

    await drizzle
      .update(sessions)
      .set({
        expiresAt,
        updatedAt,
      })
      .where(eq(sessions.token, token));

    return expiresAt;
  }

  it.each(['/api/v1/auth/get-session', '/api/internal/users'])(
    'renews the session cookie through %s',
    async (path) => {
      const { token, cookie } = await createSession();
      const previousExpiry = await ageSession(token);

      const response = await app.request(path, {
        headers: {
          cookie,
        },
      });

      expect(response.status).toBe(200);

      const renewedCookies = response.headers.getSetCookie().filter((value) => {
        return value.startsWith(SESSION_COOKIE_PREFIX);
      });

      expect(renewedCookies).toHaveLength(1);
      expect(renewedCookies[0]).not.toContain('Max-Age=0');

      const refreshedSession = await drizzle.query.sessions.findFirst({
        where: eq(sessions.token, token),
      });

      expect(refreshedSession?.expiresAt.getTime()).toBeGreaterThan(
        previousExpiry.getTime(),
      );

      const nextResponse = await app.request(path, {
        headers: {
          cookie,
        },
      });

      expect(nextResponse.status).toBe(200);
      expect(
        nextResponse.headers.getSetCookie().filter((value) => {
          return value.startsWith(SESSION_COOKIE_PREFIX);
        }),
      ).toHaveLength(0);
    },
  );

  it('clears an aging session on sign-out without renewing its cookie', async () => {
    const { token, cookie } = await createSession();

    await ageSession(token);

    const response = await app.request('/api/v1/auth/sign-out', {
      method: 'POST',
      headers: {
        cookie,
      },
    });

    expect(response.status).toBe(200);

    const sessionCookies = response.headers.getSetCookie().filter((value) => {
      return value.startsWith(SESSION_COOKIE_PREFIX);
    });

    expect(sessionCookies).toHaveLength(1);
    expect(sessionCookies[0]).toContain('Max-Age=0');

    const session = await drizzle.query.sessions.findFirst({
      where: eq(sessions.token, token),
    });

    expect(session).toBeUndefined();
  });
});
