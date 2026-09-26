import '#/infrastructure/common/loadEnv';

import { initInfra, startServer } from '#/adapters/restful/hono';

await initInfra();

await startServer();
