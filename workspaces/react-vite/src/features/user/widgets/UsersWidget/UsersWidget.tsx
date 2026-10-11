import { cn } from '@react/design-system/utils';
import { useQuery } from '@tanstack/react-query';
import { type JSX, useState } from 'react';

import { useLocale } from '#/integrations/i18n/LocaleProvider';
import { m } from '#/integrations/i18n/paraglide/messages';

import { getUsers } from '../../api';
import { UserTable } from '../../components';

export function UsersWidget(): JSX.Element {
  useLocale();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const { isPending, isError, data } = useQuery({
    queryKey: ['users', pagination],
    queryFn: () => getUsers(pagination),
  });

  if (isPending) {
    return (
      <p className={cn('text-sm text-muted-foreground')}>
        {m['page.users.loading']()}
      </p>
    );
  }

  if (isError) {
    return (
      <p className={cn('text-sm text-destructive')} role='alert'>
        {m['page.users.loadError']()}
      </p>
    );
  }

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
