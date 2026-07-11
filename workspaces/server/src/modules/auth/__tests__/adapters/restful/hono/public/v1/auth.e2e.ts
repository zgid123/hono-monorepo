import { HonoTest } from '@alphacifer/hono/testing';
import { faker } from '@faker-js/faker';
import { makeSignature } from 'better-auth/crypto';

import { initHono, type TApp } from '#/adapters/restful/hono';
import { env } from '#/infrastructure/common/env';

interface IAuthResponse {
  token: string;
}

describe('Public Auth Endpoints', () => {
  let app: TApp;
  let honoTest: HonoTest<TApp>;

  const email = faker.internet.email().toLowerCase();
  const password = 'ChangeMe123!';

  const getSessionCookie = async (token: string): Promise<string> => {
    const signature = await makeSignature(token, env.BETTER_AUTH_SECRET);

    return `hono-monorepo.session_token=${token}.${signature}`;
  };

  beforeAll(async () => {
    app = (await initHono()).app;

    honoTest = HonoTest.create(app);
  });

  describe('POST /api/v1/auth/sign-up/email', () => {
    suite('when the credentials are valid', () => {
      it('creates the user and starts a session', async () => {
        const response = await honoTest.post('/api/v1/auth/sign-up/email', {
          name: 'Auth E2E User',
          email,
          password,
        });

        expect(response.jsonData).toMatchObject({
          token: expect.any(String),
          user: {
            name: 'Auth E2E User',
            email,
          },
        });
      });
    });
  });

  describe('POST /api/v1/auth/sign-in/email', () => {
    suite('when the credentials are valid', () => {
      it('starts a session for the user', async () => {
        await honoTest.post('/api/v1/auth/sign-up/email', {
          name: 'Auth E2E User',
          email,
          password,
        });
        const response = await honoTest.post('/api/v1/auth/sign-in/email', {
          email,
          password,
        });

        expect(response.jsonData).toMatchObject({
          token: expect.any(String),
          user: {
            email,
          },
        });
      });
    });
  });

  describe('GET /api/v1/auth/get-session', () => {
    suite('when a valid session cookie is provided', () => {
      it('returns the current session and user', async () => {
        await honoTest.post('/api/v1/auth/sign-up/email', {
          name: 'Auth E2E User',
          email,
          password,
        });
        const signInResponse = await honoTest.post(
          '/api/v1/auth/sign-in/email',
          {
            email,
            password,
          },
        );
        const response = await honoTest.get(
          '/api/v1/auth/get-session',
          undefined,
          {
            headers: {
              cookie: await getSessionCookie(
                (signInResponse.jsonData as unknown as IAuthResponse).token,
              ),
            },
          },
        );

        expect(response.jsonData).toMatchObject({
          session: expect.any(Object),
          user: {
            email,
          },
        });
      });
    });

    suite('when no session cookie is provided', () => {
      it('returns an anonymous session', async () => {
        const response = await honoTest.get('/api/v1/auth/get-session');

        expect(response.jsonData).toBeNull();
      });
    });
  });

  describe('POST /api/v1/auth/sign-out', () => {
    suite('when a valid session cookie is provided', () => {
      it('ends the current session', async () => {
        await honoTest.post('/api/v1/auth/sign-up/email', {
          name: 'Auth E2E User',
          email,
          password,
        });
        const signInResponse = await honoTest.post(
          '/api/v1/auth/sign-in/email',
          {
            email,
            password,
          },
        );
        const response = await honoTest.post(
          '/api/v1/auth/sign-out',
          undefined,
          {
            headers: {
              cookie: await getSessionCookie(
                (signInResponse.jsonData as unknown as IAuthResponse).token,
              ),
            },
          },
        );

        expect(response.jsonData).toEqual({
          success: true,
        });
      });
    });
  });
});
