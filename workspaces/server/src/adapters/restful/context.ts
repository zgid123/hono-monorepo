import type { UserEntity } from '@domain/auth';
import type { ICoreContextVariables } from '@node/hono/interfaces';

import type { TDrizzle } from '#/infrastructure/drizzle/config';

export type TContext = ICoreContextVariables<{
  drizzle: TDrizzle;
  currentUser: UserEntity;
}>;
