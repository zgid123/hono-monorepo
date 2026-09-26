import { AuthError, UserEntity } from '@domain/auth';
import { createMiddleware } from 'hono/factory';

import { auth } from '../../../../infrastructure/betterAuth/instance';
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

    const role = currentSession.user.role;

    if (role !== 'user' && role !== 'admin') {
      throw new TypeError(`Unsupported user role: ${String(role)}`);
    }

    c.set(
      'currentUser',
      UserEntity.create({
        role,
        id: currentSession.user.id,
        name: currentSession.user.name,
        email: currentSession.user.email,
        image: currentSession.user.image ?? null,
        createdAt: currentSession.user.createdAt,
        updatedAt: currentSession.user.updatedAt,
        emailVerified: currentSession.user.emailVerified,
        banReason: currentSession.user.banReason ?? null,
        banExpires: currentSession.user.banExpires ?? null,
        displayName: currentSession.user.displayName ?? null,
        status: currentSession.user.banned ? 'banned' : 'active',
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
    if (!c.var.currentUser) {
      throw AuthError.unauthorized();
    }

    if (c.var.currentUser.role !== 'admin') {
      throw AuthError.insufficientPermissions();
    }

    await next();
  },
);
