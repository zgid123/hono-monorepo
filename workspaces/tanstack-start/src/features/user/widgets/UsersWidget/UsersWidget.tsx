import { useSuspenseQuery } from '@tanstack/react-query';
import { type JSX, useState } from 'react';

import { UserTable } from '../../components';
import { getUsersQueryOptions } from '../../queries';

export function UsersWidget(): JSX.Element {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const { data } = useSuspenseQuery(getUsersQueryOptions(pagination));

  return (
    <UserTable
      limit={pagination.limit}
      onLimitChange={(limit) => {
        setPagination({
          limit,
          page: 1,
        });
      }}
      onPageChange={(page) => {
        setPagination((currentPagination) => {
          return {
            ...currentPagination,
            page,
          };
        });
      }}
      page={pagination.page}
      totalPages={data.metadata.totalPages}
      users={data.data}
    />
  );
}
