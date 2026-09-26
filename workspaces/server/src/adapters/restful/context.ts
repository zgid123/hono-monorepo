import type { UserEntity } from '@domain/auth';
import type { ICoreContextVariables } from '@node/hono/interfaces';

import type { IWireContainer } from './wire';

export type TContext = ICoreContextVariables<
  IWireContainer & {
    currentUser: UserEntity | undefined;
  }
>;
