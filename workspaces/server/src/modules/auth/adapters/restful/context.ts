import type { Cqrsx } from '@cqrsx/core';
import type { UserEntity } from '@domain/auth';
import type { Env } from 'hono';

import type { TDrizzle } from '#/infrastructure/drizzle/config';

export interface IAuthContextVariables extends Env {
  // biome-ignore lint/style/useNamingConvention: hono typing
  Variables: {
    cqrsx: Cqrsx;
    drizzle: TDrizzle;
    currentUser: UserEntity;
  };
}
