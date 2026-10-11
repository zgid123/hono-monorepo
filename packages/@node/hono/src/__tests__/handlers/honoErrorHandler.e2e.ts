import { HonoError } from '@alphacifer/hono/core';
import { ApplicationError } from '@domain/core';
import { Hono } from 'hono';

import { honoErrorHandler } from '../../handlers/honoErrorHandler';

describe('#honoErrorHandler', () => {
  suite('when a handler throws an application error', () => {
    it('returns the application status and public error payload', async () => {
      const app = new Hono().onError(honoErrorHandler).get('/', () => {
        throw new ApplicationError({
          code: 20001,
          name: 'USER_NOT_FOUND',
          message: 'User not found',
          httpCode: 404,
        });
      });

      const response = await app.request('/');

      expect(response.status).toBe(404);

      await expect(response.json()).resolves.toEqual({
        code: 20001,
        name: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    });
  });

  suite('when a handler throws a Hono error', () => {
    it('preserves its status, code, and validation details', async () => {
      const detail = {
        email: 'Invalid email',
      };
      const app = new Hono().onError(honoErrorHandler).get('/', () => {
        throw new HonoError({
          code: 10001,
          name: 'INVALID_PARAMS',
          message: 'Invalid params',
          status: 400,
          detail,
        });
      });

      const response = await app.request('/');

      expect(response.status).toBe(400);

      await expect(response.json()).resolves.toEqual({
        code: 10001,
        name: 'INVALID_PARAMS',
        message: 'Invalid params',
        detail,
      });
    });
  });

  suite('when a handler throws an unexpected error', () => {
    it('returns a generic server error without exposing internal details', async () => {
      const app = new Hono().onError(honoErrorHandler).get('/', () => {
        throw new Error('Internal database connection failed');
      });

      const response = await app.request('/');

      expect(response.status).toBe(500);

      await expect(response.json()).resolves.toEqual({
        code: 10000,
        name: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong!',
      });
    });
  });
});
