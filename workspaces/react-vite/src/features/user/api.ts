import type {
  TInternalUsersViewModel,
  TInternalUserViewModel,
} from '@contracts/auth';

import { apiClient } from '#/integrations/axios/apiClient';

export type TUser = TInternalUserViewModel;

export interface IGetUsersParams {
  page: number;
  limit: number;
}

export async function getUsers({
  page,
  limit,
}: IGetUsersParams): Promise<TInternalUsersViewModel> {
  return apiClient.get<TInternalUsersViewModel>({
    url: '/api/internal/users',
    params: {
      page,
      limit,
    },
  });
}
