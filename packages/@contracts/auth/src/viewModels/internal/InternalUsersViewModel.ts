import { PaginationViewModel } from '@contracts/core';
import { createSchema } from '@eidora/arktype';
import { type } from 'arktype';

import { InternalUserViewModel } from './InternalUserViewModel';

const internalUsersViewModel = type({
  data: InternalUserViewModel.schema.array(),
  metadata: PaginationViewModel,
});

export const InternalUsersViewModel = createSchema(internalUsersViewModel);

export type TInternalUsersViewModel = typeof internalUsersViewModel.infer;
