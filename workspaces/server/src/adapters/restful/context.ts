import type { ICoreContextVariables } from '@node/hono/interfaces';

import type { TDrizzle } from '#/infrastructure/drizzle/config';

export type TContext = ICoreContextVariables<{
  drizzle: TDrizzle;
}>;
