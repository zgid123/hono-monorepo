import { Hono } from 'hono';

import { baseEndpoints } from './base';
import { internalEndpoints } from './internal';
import { v1Endpoints } from './v1';

export const endpoints = new Hono()
  .route('/', baseEndpoints)
  .route('/api/v1', v1Endpoints)
  .route('/api/internal', internalEndpoints);
