import { createSchema } from '@eidora/arktype';
import { type } from 'arktype';

import { Role, UserStatus } from '../../schemas';

const internalUserViewModel = type({
  id: 'string',
  role: Role,
  status: UserStatus,
  name: 'string',
  email: 'string.email',
  image: 'string | null',
  createdAt: 'string',
  updatedAt: 'string',
  displayName: 'string | null',
  emailVerified: 'boolean',
});

export const InternalUserViewModel = createSchema(internalUserViewModel);

export type TInternalUserViewModel = typeof internalUserViewModel.infer;
