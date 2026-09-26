import type { Cqrsx } from '@cqrsx/core';
import type { UserEntity } from '@domain/auth';
import type { Env } from 'hono';

export interface IAuthContextVariables extends Env {
  // biome-ignore lint/style/useNamingConvention: hono typing
  Variables: {
    cqrsx: Cqrsx;
    currentUser: UserEntity | undefined;
  };
}

export interface IAuthenticatedContextVariables extends Env {
  // biome-ignore lint/style/useNamingConvention: hono typing
  Variables: {
    cqrsx: Cqrsx;
    currentUser: UserEntity;
  };
}
