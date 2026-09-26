import { eq } from '@alphacifer/drizzle/core';
import { HonoTest } from '@alphacifer/hono/testing';
import {
  CANNOT_BAN_CURRENT_USER_CODE,
  CANNOT_BAN_CURRENT_USER_MESSAGE,
  CANNOT_BAN_CURRENT_USER_NAME,
  INSUFFICIENT_PERMISSIONS_CODE,
  INSUFFICIENT_PERMISSIONS_MESSAGE,
  INSUFFICIENT_PERMISSIONS_NAME,
  UNAUTHORIZED_CODE,
  UNAUTHORIZED_MESSAGE,
  UNAUTHORIZED_NAME,
  USER_ALREADY_EXISTS_CODE,
  USER_ALREADY_EXISTS_NAME,
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_NAME,
} from '@contracts/auth';
import { faker } from '@faker-js/faker';
import { makeSignature } from 'better-auth/crypto';

import { createApp, type TApp } from '#/adapters/restful/hono';
import { env } from '#/infrastructure/common/env';
import { drizzle } from '#/infrastructure/drizzle/instance';

import { users } from '../../../../../infrastructure/drizzle/schemas/users';
import { userFactory } from '../../../../factories/drizzle/UserFactory';

interface IAuthenticatedUser {
  readonly cookie: string;
  readonly userId: string;
}

describe('Internal Users Endpoints', () => {
  let app: TApp;
  let honoTest: HonoTest<TApp>;

  const createAuthenticatedUser = async (
    role: 'user' | 'admin',
  ): Promise<IAuthenticatedUser> => {
    const email = faker.internet.email().toLowerCase();
    const response = await honoTest.post('/api/v1/auth/sign-up/email', {
      name: faker.person.fullName(),
      email,
      password: 'ChangeMe123!',
    });
    const { token, user } = response.jsonData as unknown as {
      token: string;
      user: {
        id: string;
      };
    };

    if (role === 'admin') {
      await drizzle
        .update(users)
        .set({
          role,
        })
        .where(eq(users.email, email));
    }

    const signature = await makeSignature(token, env.BETTER_AUTH_SECRET);

    return {
      userId: user.id,
      cookie: `hono-monorepo.session_token=${token}.${signature}`,
    };
  };

  beforeAll(() => {
    app = createApp();
    honoTest = HonoTest.create(app);
  });

  describe('GET /api/internal/users', () => {
    suite('when the current user is an admin', () => {
      it('returns the users list', async () => {
        const user = await userFactory.create();
        const admin = await createAuthenticatedUser('admin');
        const response = await honoTest.get('/api/internal/users', undefined, {
          headers: {
            cookie: admin.cookie,
          },
        });

        expect(response.jsonData.data).toContainEqual(
          expect.objectContaining({
            id: user.id,
            email: user.email,
            name: user.name,
            status: 'active',
            image: user.image,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          }),
        );
        const responseData = response.jsonData as unknown as {
          metadata: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };

        expect(responseData.metadata).toEqual(
          expect.objectContaining({
            page: 1,
            limit: 10,
            total: expect.any(Number),
            totalPages: expect.any(Number),
          }),
        );
      });
    });

    suite('when the current user is not an admin', () => {
      it('returns forbidden', async () => {
        const currentUser = await createAuthenticatedUser('user');
        const response = await app.request('/api/internal/users', {
          headers: {
            cookie: currentUser.cookie,
          },
        });

        expect(response.status).toEqual(403);

        await expect(response.json()).resolves.toEqual({
          name: INSUFFICIENT_PERMISSIONS_NAME,
          code: INSUFFICIENT_PERMISSIONS_CODE,
          message: INSUFFICIENT_PERMISSIONS_MESSAGE,
        });
      });
    });

    suite('when there is no current user', () => {
      it('returns unauthorized', async () => {
        const response = await app.request('/api/internal/users');

        expect(response.status).toEqual(401);
        await expect(response.json()).resolves.toEqual({
          name: UNAUTHORIZED_NAME,
          code: UNAUTHORIZED_CODE,
          message: UNAUTHORIZED_MESSAGE,
        });
      });
    });
  });

  describe('POST /api/internal/users', () => {
    suite('when the current user is an admin', () => {
      it('creates a credential user without leaving a target session', async () => {
        const admin = await createAuthenticatedUser('admin');

        const email = faker.internet.email().toLowerCase();

        const response = await app.request('/api/internal/users', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Created User',
            email,
            password: 'ChangeMe123!',
            displayName: 'Created Display Name',
          }),
          headers: {
            cookie: admin.cookie,
            'content-type': 'application/json',
          },
        });

        const createdUser = await drizzle.query.users.findFirst({
          where: (table, { eq: equals }) => {
            return equals(table.email, email);
          },
          with: {
            accounts: true,
            sessions: true,
          },
        });

        expect(response.status).toEqual(201);
        expect(createdUser).toEqual(
          expect.objectContaining({
            name: 'Created User',
            email,
            displayName: 'Created Display Name',
          }),
        );
        expect(createdUser?.accounts).toEqual([
          expect.objectContaining({
            providerId: 'credential',
          }),
        ]);
        expect(createdUser?.sessions).toEqual([]);
      });
    });

    suite('when the email already exists', () => {
      it('returns the user-already-exists error', async () => {
        const admin = await createAuthenticatedUser('admin');

        const email = faker.internet.email().toLowerCase();
        const body = JSON.stringify({
          name: 'Created User',
          email,
          password: 'ChangeMe123!',
        });
        const headers = {
          cookie: admin.cookie,
          'content-type': 'application/json',
        };

        const firstResponse = await app.request('/api/internal/users', {
          method: 'POST',
          body,
          headers,
        });
        const duplicateResponse = await app.request('/api/internal/users', {
          method: 'POST',
          body,
          headers,
        });

        expect(firstResponse.status).toEqual(201);
        expect(duplicateResponse.status).toEqual(409);

        await expect(duplicateResponse.json()).resolves.toEqual({
          name: USER_ALREADY_EXISTS_NAME,
          code: USER_ALREADY_EXISTS_CODE,
          message: `A user with email ${email} already exists`,
        });
      });
    });
  });

  describe('GET /api/internal/users/:userId', () => {
    suite('when the user exists', () => {
      it('returns the serialized user', async () => {
        const user = await userFactory.create({
          image: 'https://example.com/avatar.png',
          emailVerified: true,
        });
        const admin = await createAuthenticatedUser('admin');
        const response = await honoTest.get(
          `/api/internal/users/${user.id}`,
          undefined,
          {
            headers: {
              cookie: admin.cookie,
            },
          },
        );

        expect(response.jsonData.data).toEqual(
          expect.objectContaining({
            id: user.id,
            image: user.image,
            status: 'active',
            emailVerified: true,
          }),
        );
      });
    });

    suite('when the user does not exist', () => {
      it('returns the user-not-found error', async () => {
        const admin = await createAuthenticatedUser('admin');
        const response = await app.request(
          '/api/internal/users/019c820f-5a60-7000-8000-000000000001',
          {
            headers: {
              cookie: admin.cookie,
            },
          },
        );

        expect(response.status).toEqual(404);

        await expect(response.json()).resolves.toEqual({
          name: USER_NOT_FOUND_NAME,
          code: USER_NOT_FOUND_CODE,
          message: USER_NOT_FOUND_MESSAGE,
        });
      });
    });
  });

  describe('PATCH /api/internal/users/:userId', () => {
    suite('when the user exists', () => {
      it('updates the user profile', async () => {
        const user = await userFactory.create();
        const admin = await createAuthenticatedUser('admin');
        const response = await app.request(`/api/internal/users/${user.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: 'Updated User',
            displayName: 'Updated Display Name',
          }),
          headers: {
            cookie: admin.cookie,
            'content-type': 'application/json',
          },
        });
        const updatedUser = await drizzle.query.users.findFirst({
          where: (table, { eq: equals }) => {
            return equals(table.id, user.id);
          },
        });

        expect(response.status).toEqual(204);
        expect(updatedUser).toEqual(
          expect.objectContaining({
            name: 'Updated User',
            displayName: 'Updated Display Name',
          }),
        );
      });
    });
  });

  describe('PATCH /api/internal/users/:userId/role', () => {
    suite('when the user exists', () => {
      it('changes the user role', async () => {
        const user = await userFactory.create();
        const admin = await createAuthenticatedUser('admin');
        const response = await app.request(
          `/api/internal/users/${user.id}/role`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              role: 'admin',
            }),
            headers: {
              cookie: admin.cookie,
              'content-type': 'application/json',
            },
          },
        );
        const updatedUser = await drizzle.query.users.findFirst({
          where: (table, { eq: equals }) => {
            return equals(table.id, user.id);
          },
        });

        expect(response.status).toEqual(204);
        expect(updatedUser?.role).toEqual('admin');
      });
    });
  });

  describe('PATCH /api/internal/users/:userId/status', () => {
    suite('when an admin bans another user', () => {
      it('keeps the user and revokes their sessions', async () => {
        const target = await createAuthenticatedUser('user');
        const admin = await createAuthenticatedUser('admin');
        const response = await app.request(
          `/api/internal/users/${target.userId}/status`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              status: 'banned',
            }),
            headers: {
              cookie: admin.cookie,
              'content-type': 'application/json',
            },
          },
        );
        const bannedUser = await drizzle.query.users.findFirst({
          where: (table, { eq: equals }) => {
            return equals(table.id, target.userId);
          },
          with: {
            sessions: true,
          },
        });

        expect(response.status).toEqual(204);
        expect(bannedUser).toEqual(
          expect.objectContaining({
            banned: true,
            sessions: [],
          }),
        );
      });
    });

    suite('when an admin reactivates a banned user', () => {
      it('changes the user status to active', async () => {
        const user = await userFactory.create({
          banned: true,
        });
        const admin = await createAuthenticatedUser('admin');
        const response = await app.request(
          `/api/internal/users/${user.id}/status`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              status: 'active',
            }),
            headers: {
              cookie: admin.cookie,
              'content-type': 'application/json',
            },
          },
        );
        const activeUser = await drizzle.query.users.findFirst({
          where: (table, { eq: equals }) => {
            return equals(table.id, user.id);
          },
        });

        expect(response.status).toEqual(204);
        expect(activeUser?.banned).toBe(false);
      });
    });

    suite('when an admin bans themselves', () => {
      it('returns the cannot-ban-current-user error', async () => {
        const admin = await createAuthenticatedUser('admin');
        const response = await app.request(
          `/api/internal/users/${admin.userId}/status`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              status: 'banned',
            }),
            headers: {
              cookie: admin.cookie,
              'content-type': 'application/json',
            },
          },
        );

        expect(response.status).toEqual(409);

        await expect(response.json()).resolves.toEqual({
          name: CANNOT_BAN_CURRENT_USER_NAME,
          code: CANNOT_BAN_CURRENT_USER_CODE,
          message: CANNOT_BAN_CURRENT_USER_MESSAGE,
        });
      });
    });
  });
});
