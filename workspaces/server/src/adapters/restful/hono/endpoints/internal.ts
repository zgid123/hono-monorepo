import { Hono } from 'hono';

import { usersEndpoint } from '#/modules/auth/adapters/restful/hono/internal/users';

export const internalEndpoints = new Hono().route('/users', usersEndpoint);
