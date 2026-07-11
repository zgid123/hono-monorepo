import { HonoTest } from '@alphacifer/hono/testing';

import { initHono, type TApp } from '#/adapters/restful/hono';

import { userFactory } from '../../../../factories/drizzle/UserFactory';

describe('Internal Users Endpoints', () => {
  let app: TApp;
  let honoTest: HonoTest<TApp>;

  beforeAll(async () => {
    app = (await initHono()).app;

    honoTest = HonoTest.create(app);
  });

  describe('GET /api/internal/users', () => {
    suite('when the service is running', () => {
      it('returns the users list', async () => {
        const user = await userFactory.create();
        const response = await honoTest.get('/api/internal/users');

        expect(response.jsonData.data).toContainEqual(
          expect.objectContaining({
            id: user.id,
            email: user.email,
            name: user.name,
          }),
        );
      });
    });
  });
});
