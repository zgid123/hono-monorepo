import { Hono } from 'hono';

import { auth } from '../../../../../infrastructure/betterAuth/instance';
import type { IAuthContextVariables } from '../../../context';

export const authEndpoints = new Hono<IAuthContextVariables>().all(
  '/*',
  async (c) => {
    return auth.handler(c.req.raw);
  },
);
