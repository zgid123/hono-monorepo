import {
  DataTable,
  type TDataTableColumnDef,
} from '@react/design-system/components';
import type { JSX } from 'react';

import { useLocale } from '#/integrations/i18n/LocaleProvider';
import { m } from '#/integrations/i18n/paraglide/messages';

import type { TUser } from '../../api';

interface IUserTableProps {
  page: number;
  limit: number;
  users: TUser[];
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function UserTable({
  page,
  limit,
  users,
  totalPages,
  onPageChange,
  onLimitChange,
}: IUserTableProps): JSX.Element {
  const { locale } = useLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  });
  const columns: TDataTableColumnDef<TUser>[] = [
    {
      accessorKey: 'name',
      header: m['auth.model.name'](),
      cell: ({ row }) => {
        return row.original.displayName || row.original.name;
      },
    },
    {
      accessorKey: 'email',
      header: m['auth.model.email'](),
    },
    {
      accessorKey: 'role',
      header: m['auth.model.role'](),
    },
    {
      accessorKey: 'createdAt',
      header: m['auth.model.createdAt'](),
      cell: ({ getValue }) => {
        return dateFormatter.format(new Date(getValue<string>()));
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      emptyMessage={m['page.users.empty']()}
      onPageChange={onPageChange}
      onPageSizeChange={onLimitChange}
      pagination={{
        page,
        pageSize: limit,
      }}
      paginationLabels={{
        next: m['pagy.next'](),
        previous: m['pagy.previous'](),
        rowsPerPage: m['pagy.rowsPerPage'](),
      }}
      totalPages={totalPages}
    />
  );
}
