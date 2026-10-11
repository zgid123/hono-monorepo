import { Hono } from 'hono';

import type { ICoreContextVariables } from '../../interfaces/context';
import { createWireMiddleware } from '../../middlewares/wireMiddleware';

describe('#createWireMiddleware', () => {
  suite('when dependencies are supplied', () => {
    it('makes every dependency available to downstream handlers', async () => {
      const wire = {
        users: {
          name: 'users',
        },
        orders: {
          name: 'orders',
        },
      };
      const app = new Hono<ICoreContextVariables<typeof wire>>()
        .use(
          createWireMiddleware({
            wire,
          }),
        )
        .get('/', (context) => {
          expect(context.get('users')).toBe(wire.users);
          expect(context.get('orders')).toBe(wire.orders);

          return context.json({
            users: context.get('users').name,
            orders: context.get('orders').name,
          });
        });

      const response = await app.request('/');

      expect(response.status).toBe(200);

      await expect(response.json()).resolves.toEqual({
        users: 'users',
        orders: 'orders',
      });
    });
  });

  suite('when the container is empty', () => {
    it('continues to the downstream handler', async () => {
      const app = new Hono()
        .use(
          createWireMiddleware({
            wire: {},
          }),
        )
        .get('/', (context) => context.text('Ok!'));

      const response = await app.request('/');

      expect(response.status).toBe(200);

      expect(await response.text()).toBe('Ok!');
    });
  });
});
