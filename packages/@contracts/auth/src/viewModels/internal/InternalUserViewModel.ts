import { createSchema } from '@eidora/arktype';
import { type } from 'arktype';

import { RoleSchema, UserStatusSchema } from '../../schemas';

const internalUserViewModel = type({
  id: 'string',
  role: RoleSchema,
  status: UserStatusSchema,
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
