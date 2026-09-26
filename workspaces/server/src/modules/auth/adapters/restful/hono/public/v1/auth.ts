import { arkValidator } from '@alphacifer/hono/arktype-validator';
import { SignIn, SignUp } from '@contracts/auth';
import type { Context, Handler } from 'hono';
import { Hono } from 'hono';

import { auth } from '../../../../../infrastructure/betterAuth/instance';
import type { IAuthContextVariables } from '../../../context';

function createValidatedRequest(
  c: Context<IAuthContextVariables>,
  body: unknown,
): Request {
  return new Request(c.req.url, {
    body: JSON.stringify(body),
    method: c.req.method,
    headers: c.req.raw.headers,
  });
}

const forward: Handler<IAuthContextVariables> = (c) => {
  return auth.handler(c.req.raw);
};

export const authEndpoints = new Hono<IAuthContextVariables>()
  .post('/sign-in/email', arkValidator('json', SignIn), (c) => {
    return auth.handler(createValidatedRequest(c, c.req.valid('json')));
  })
  .post('/sign-up/email', arkValidator('json', SignUp), (c) => {
    return auth.handler(createValidatedRequest(c, c.req.valid('json')));
  })
  .post('/sign-out', forward)
  .get('/get-session', forward);
