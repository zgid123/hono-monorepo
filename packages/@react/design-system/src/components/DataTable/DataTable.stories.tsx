import type { Meta, StoryObj } from '@storybook/react-vite';
import { type JSX, useState } from 'react';

import {
  DataTable,
  type IDataTableProps,
  type TDataTableColumnDef,
} from './DataTable';

interface IUserRow {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: TDataTableColumnDef<IUserRow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

const users: IUserRow[] = Array.from(
  {
    length: 37,
  },
  (_, index) => {
    const userNumber = index + 1;

    return {
      id: userNumber,
      name: `User ${userNumber}`,
      email: `user${userNumber}@example.com`,
      role: userNumber % 5 === 0 ? 'Admin' : 'User',
    };
  },
);

const meta: Meta<IDataTableProps<IUserRow>> = {
  title: 'Design System/DataTable',
  args: {
    columns,
    data: users,
    paginationLabels: {
      next: 'Next',
      previous: 'Previous',
      rowsPerPage: 'Rows per page',
    },
  },
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type TStory = StoryObj<IDataTableProps<IUserRow>>;

export const Default: TStory = {};

function ServerPaginationExample(): JSX.Element {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const startIndex = (page - 1) * pageSize;
  const pageUsers = users.slice(startIndex, startIndex + pageSize);

  return (
    <DataTable
      columns={columns}
      data={pageUsers}
      onPageChange={setPage}
      onPageSizeChange={(nextPageSize) => {
        setPage(1);
        setPageSize(nextPageSize);
      }}
      pagination={{
        page,
        pageSize,
      }}
      paginationLabels={{
        next: 'Next',
        previous: 'Previous',
        rowsPerPage: 'Rows per page',
      }}
      totalPages={Math.ceil(users.length / pageSize)}
    />
  );
}

export const ServerPagination: TStory = {
  args: {
    onPageChange: () => undefined,
    onPageSizeChange: () => undefined,
    pagination: {
      page: 1,
      pageSize: 10,
    },
    totalPages: 4,
  },
  render: () => {
    return <ServerPaginationExample />;
  },
};

export const Empty: TStory = {
  args: {
    data: [],
    emptyMessage: 'No users found.',
  },
};
