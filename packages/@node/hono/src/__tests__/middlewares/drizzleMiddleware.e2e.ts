import { Hono } from 'hono';

import type { ICoreContextVariables } from '../../interfaces/context';
import { createDrizzleMiddleware } from '../../middlewares/drizzleMiddleware';

describe('#createDrizzleMiddleware', () => {
  suite('when a request reaches a downstream handler', () => {
    it('makes the supplied database instance available in context', async () => {
      const drizzle = {
        name: 'database',
      };
      const app = new Hono<ICoreContextVariables<{ drizzle: typeof drizzle }>>()
        .use(
          createDrizzleMiddleware({
            drizzle,
          }),
        )
        .get('/', (context) => {
          expect(context.get('drizzle')).toBe(drizzle);

          return context.json({
            database: context.get('drizzle').name,
          });
        });

      const response = await app.request('/');

      expect(response.status).toBe(200);

      await expect(response.json()).resolves.toEqual({
        database: 'database',
      });
    });
  });
});
