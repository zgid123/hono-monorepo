import '#/infrastructure/common/loadEnv';

import { startServer } from '#/adapters/restful/hono';

await startServer();
