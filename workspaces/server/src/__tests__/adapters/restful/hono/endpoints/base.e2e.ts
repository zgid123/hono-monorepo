import { HonoTest } from '@alphacifer/hono/testing';

import { initHono, type TApp } from '#/adapters/restful/hono';

describe('Base Endpoints', () => {
  let app: TApp;

  beforeAll(async () => {
    app = (await initHono()).app;
  });

  describe('GET /health', () => {
    suite('when the service is running', () => {
      it('returns the service health and version', async () => {
        const response = await HonoTest.create(app).get('/health');

        expect(response.jsonData).toEqual({
          message: 'Ok!',
          version: '0.0.1',
        });
      });
    });
  });
});
