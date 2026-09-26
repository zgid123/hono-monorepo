import type { Cqrsx } from '@cqrsx/core';

import type { TDrizzle } from '#/infrastructure/drizzle/config';

import {
  ChangeUserRoleCommand,
  ChangeUserRoleCommandHandler,
  ChangeUserStatusCommand,
  ChangeUserStatusCommandHandler,
  CreateUserCommand,
  CreateUserCommandHandler,
  UpdateUserProfileCommand,
  UpdateUserProfileCommandHandler,
} from '../../application/commands';
import {
  GetUserQuery,
  GetUserQueryHandler,
  ListUsersQuery,
  ListUsersQueryHandler,
} from '../../application/queries';
import { auth } from '../../infrastructure/betterAuth/instance';
import { UserProvisioner } from '../../infrastructure/betterAuth/services';
import { UserRepository } from '../../infrastructure/drizzle/repositories';

export interface IWireAuthParams {
  cqrsx: Cqrsx;
  drizzle: TDrizzle;
}

export function wireAuth({ cqrsx, drizzle }: IWireAuthParams): void {
  const userRepository = new UserRepository({
    drizzle,
  });
  cqrsx
    .register(
      ListUsersQuery,
      new ListUsersQueryHandler({
        userRepository,
      }),
    )
    .register(
      GetUserQuery,
      new GetUserQueryHandler({
        userRepository,
      }),
    )
    .register(
      CreateUserCommand,
      new CreateUserCommandHandler({
        userProvisioner: new UserProvisioner({
          auth,
        }),
      }),
    )
    .register(
      UpdateUserProfileCommand,
      new UpdateUserProfileCommandHandler({
        userRepository,
      }),
    )
    .register(
      ChangeUserRoleCommand,
      new ChangeUserRoleCommandHandler({
        userRepository,
      }),
    )
    .register(
      ChangeUserStatusCommand,
      new ChangeUserStatusCommandHandler({
        userRepository,
      }),
    );
}
