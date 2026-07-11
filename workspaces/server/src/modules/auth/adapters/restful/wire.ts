import type { Cqrsx } from '@cqrsx/core';

import type { TDrizzle } from '#/infrastructure/drizzle/config';

import {
  ListUsersQuery,
  ListUsersQueryHandler,
} from '../../application/queries';
import { UserRepository } from '../../infrastructure/drizzle/repositories';

export interface IWireAuthParams {
  cqrsx: Cqrsx;
  drizzle: TDrizzle;
}

export function wireAuth({ cqrsx, drizzle }: IWireAuthParams): void {
  const userRepository = new UserRepository({
    drizzle,
  });

  cqrsx.register(
    ListUsersQuery,
    new ListUsersQueryHandler({
      userRepository,
    }),
  );
}
