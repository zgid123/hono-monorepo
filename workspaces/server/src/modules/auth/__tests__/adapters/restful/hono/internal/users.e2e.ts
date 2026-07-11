import { eq } from '@alphacifer/drizzle/core';
import { HonoTest } from '@alphacifer/hono/testing';
import { UNAUTHORIZED_CODE, UNAUTHORIZED_NAME } from '@domain/auth';
import { faker } from '@faker-js/faker';
import { makeSignature } from 'better-auth/crypto';

import { initHono, type TApp } from '#/adapters/restful/hono';
import { env } from '#/infrastructure/common/env';
import { drizzle } from '#/infrastructure/drizzle/instance';
import { users } from '#/infrastructure/drizzle/schemas/users';

import { userFactory } from '../../../../factories/drizzle/UserFactory';

describe('Internal Users Endpoints', () => {
  let app: TApp;
  let honoTest: HonoTest<TApp>;

  const createSessionCookie = async (
    role: 'user' | 'admin',
  ): Promise<string> => {
    const email = faker.internet.email().toLowerCase();
    const response = await honoTest.post('/api/v1/auth/sign-up/email', {
      name: faker.person.fullName(),
      email,
      password: 'ChangeMe123!',
    });
    const { token } = response.jsonData as unknown as { token: string };

    if (role === 'admin') {
      await drizzle
        .update(users)
        .set({
          role,
        })
        .where(eq(users.email, email));
    }

    const signature = await makeSignature(token, env.BETTER_AUTH_SECRET);

    return `hono-monorepo.session_token=${token}.${signature}`;
  };

  beforeAll(async () => {
    app = (await initHono()).app;

    honoTest = HonoTest.create(app);
  });

  describe('GET /api/internal/users', () => {
    suite('when the current user is an admin', () => {
      it('returns the users list', async () => {
        const user = await userFactory.create();
        const response = await honoTest.get('/api/internal/users', undefined, {
          headers: {
            cookie: await createSessionCookie('admin'),
          },
        });

        expect(response.jsonData.data).toContainEqual(
          expect.objectContaining({
            id: user.id,
            email: user.email,
            name: user.name,
          }),
        );
      });
    });

    suite('when the current user is not an admin', () => {
      it('returns unauthorized', async () => {
        const response = await app.request('/api/internal/users', {
          headers: {
            cookie: await createSessionCookie('user'),
          },
        });

        expect(response.status).toEqual(401);
        await expect(response.json()).resolves.toEqual({
          code: UNAUTHORIZED_CODE,
          name: UNAUTHORIZED_NAME,
          message: 'Unauthorized',
        });
      });
    });

    suite('when there is no current user', () => {
      it('returns unauthorized', async () => {
        const response = await app.request('/api/internal/users');

        expect(response.status).toEqual(401);
        await expect(response.json()).resolves.toEqual({
          code: UNAUTHORIZED_CODE,
          name: UNAUTHORIZED_NAME,
          message: 'Unauthorized',
        });
      });
    });
  });
});
