import type {
  TInternalUsersViewModel,
  TInternalUserViewModel,
} from '@contracts/auth';
import { resolvePagy } from '@core/utils';
import { createServerFn } from '@tanstack/react-start';

import { authenticatedApiMiddleware } from '#/integrations/axios/authenticatedApiMiddleware';

export type TUser = TInternalUserViewModel;

export interface IGetUsersParams {
  page: number;
  limit: number;
}

const fetchUsers = createServerFn({
  method: 'GET',
})
  .middleware([authenticatedApiMiddleware])
  .validator((data: IGetUsersParams): IGetUsersParams => {
    const { page, limit } = resolvePagy(data);

    return {
      page,
      limit,
    };
  })
  .handler(({ data, context }): Promise<TInternalUsersViewModel> => {
    return context.apiClient.get<TInternalUsersViewModel>({
      url: '/api/internal/users',
      params: data,
    });
  });

export async function getUsers(
  params: IGetUsersParams,
): Promise<TInternalUsersViewModel> {
  return fetchUsers({
    data: params,
  });
}
