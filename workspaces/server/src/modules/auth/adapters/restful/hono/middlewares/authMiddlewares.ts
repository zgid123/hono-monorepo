import { UserEntity } from '@domain/auth';
import { createMiddleware } from 'hono/factory';

import { AuthError } from '#/modules/auth/domain/errors';
import { auth } from '#/modules/auth/infrastructure/betterAuth/instance';

import type { IAuthContextVariables } from '../../context';

export const authenticatedUserMiddleware =
  createMiddleware<IAuthContextVariables>(async (c, next) => {
    const currentSession = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!currentSession) {
      await next();
      return;
    }

    c.set(
      'currentUser',
      UserEntity.create({
        ...currentSession.user,
        displayName: currentSession.user.displayName ?? null,
      }),
    );

    await next();
  });

export const requireUserMiddleware = createMiddleware<IAuthContextVariables>(
  async (c, next) => {
    if (!c.var.currentUser) {
      throw AuthError.unauthorized();
    }

    await next();
  },
);

export const requireAdminMiddleware = createMiddleware<IAuthContextVariables>(
  async (c, next) => {
    if (c.var.currentUser?.role !== 'admin') {
      throw AuthError.unauthorized();
    }

    await next();
  },
);
