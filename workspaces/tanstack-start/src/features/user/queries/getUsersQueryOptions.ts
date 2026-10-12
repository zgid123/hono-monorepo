import type { TInternalUsersViewModel } from '@contracts/auth';
import {
  type QueryKeyWithDataTag,
  queryOptions,
  type UnusedSkipTokenOptions,
} from '@tanstack/react-query';

import { getUsers, type IGetUsersParams } from '../api';

type TUsersQueryKey = readonly ['users', IGetUsersParams];

type TUsersQueryOptions = UnusedSkipTokenOptions<
  TInternalUsersViewModel,
  Error,
  TInternalUsersViewModel,
  TUsersQueryKey
> &
  QueryKeyWithDataTag<TUsersQueryKey, TInternalUsersViewModel, Error>;

export function getUsersQueryOptions(
  params: IGetUsersParams,
): TUsersQueryOptions {
  return queryOptions({
    queryKey: ['users', params] as const,
    queryFn: () => getUsers(params),
  });
}
