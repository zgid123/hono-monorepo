import { Hono } from 'hono';

import { authEndpoints } from '#/modules/auth/adapters/restful/hono/public/v1/auth';

export const v1Endpoints = new Hono().route('/auth', authEndpoints);
