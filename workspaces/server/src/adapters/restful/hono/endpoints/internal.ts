import { Hono } from 'hono';

import { usersEndpoint } from '#/modules/auth/adapters/restful/hono/internal/users';
import { requireAdminMiddleware } from '#/modules/auth/adapters/restful/hono/middlewares/authMiddlewares';

export const internalEndpoints = new Hono()
  .use('*', requireAdminMiddleware)
  .route('/users', usersEndpoint);
