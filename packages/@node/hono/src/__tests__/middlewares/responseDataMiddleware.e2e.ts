import { Hono } from 'hono';

import { responseDataMiddleware } from '../../middlewares/responseDataMiddleware';

describe('#responseDataMiddleware', () => {
  suite('when a handler returns JSON', () => {
    it('moves the complete payload into data', async () => {
      const payload = {
        data: [
          {
            id: 'user-1',
          },
        ],
        metadata: {
          totalPages: 2,
        },
      };
      const app = new Hono()
        .use(responseDataMiddleware)
        .get('/', (context) => context.json(payload));

      const response = await app.request('/');

      await expect(response.json()).resolves.toEqual({
        data: payload,
      });
    });
  });

  suite('when a handler sets response headers and status', () => {
    it('preserves status, cookies, and custom headers', async () => {
      const app = new Hono().use(responseDataMiddleware).get('/', (context) => {
        context.header('x-request-id', 'request-1');
        context.header('set-cookie', 'session=test; HttpOnly');
        context.header('content-length', '11');

        return context.json(
          {
            id: 'user-1',
          },
          201,
        );
      });

      const response = await app.request('/');

      expect(response.status).toBe(201);
      expect(response.headers.get('x-request-id')).toBe('request-1');
      expect(response.headers.get('set-cookie')).toBe('session=test; HttpOnly');
      expect(response.headers.has('content-length')).toBe(false);

      await expect(response.json()).resolves.toEqual({
        data: {
          id: 'user-1',
        },
      });
    });
  });

  suite('when a handler returns an error', () => {
    it('preserves the error payload', async () => {
      const app = new Hono().use(responseDataMiddleware).get('/', (context) =>
        context.json(
          {
            message: 'Unauthorized',
          },
          401,
        ),
      );

      const response = await app.request('/');

      expect(response.status).toBe(401);

      await expect(response.json()).resolves.toEqual({
        message: 'Unauthorized',
      });
    });
  });

  suite('when a handler returns no content', () => {
    it('preserves the empty body', async () => {
      const app = new Hono()
        .use(responseDataMiddleware)
        .delete('/', (context) => context.body(null, 204));

      const response = await app.request('/', {
        method: 'DELETE',
      });

      expect(response.status).toBe(204);

      expect(await response.text()).toBe('');
    });
  });

  suite('when a handler returns text', () => {
    it('preserves the text response', async () => {
      const app = new Hono()
        .use(responseDataMiddleware)
        .get('/', (context) => context.text('Ok!'));

      const response = await app.request('/');

      expect(await response.text()).toBe('Ok!');
    });
  });

  suite('when middleware is scoped to application routes', () => {
    it('leaves authentication responses unchanged', async () => {
      const app = new Hono()
        .use('/api/internal/*', responseDataMiddleware)
        .get('/api/internal/users', (context) => context.json([]))
        .get('/api/v1/auth/get-session', (context) => context.json(null));

      const response = await app.request('/api/v1/auth/get-session');

      await expect(response.json()).resolves.toBeNull();
      const usersResponse = await app.request('/api/internal/users');
      await expect(usersResponse.json()).resolves.toEqual({
        data: [],
      });
    });
  });
});
