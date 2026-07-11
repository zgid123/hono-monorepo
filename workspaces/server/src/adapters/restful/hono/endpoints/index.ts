import { Hono } from 'hono';

import { authenticatedUserMiddleware } from '#/modules/auth/adapters/restful/hono/middlewares/authMiddlewares';

import { baseEndpoints } from './base';
import { internalEndpoints } from './internal';
import { v1Endpoints } from './v1';

export const endpoints = new Hono()
  .use('*', authenticatedUserMiddleware)
  .route('/', baseEndpoints)
  .route('/api/v1', v1Endpoints)
  .route('/api/internal', internalEndpoints);
