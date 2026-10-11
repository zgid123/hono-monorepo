import type { Meta, StoryObj } from '@storybook/react-vite';
import { type JSX, useState } from 'react';

import { Pagination } from './Pagination';

const meta = {
  title: 'Design System/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type TStory = StoryObj<typeof meta>;

function PaginationExample(): JSX.Element {
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(25);

  return (
    <Pagination
      onPageChange={setPage}
      onPageSizeChange={(nextPageSize) => {
        setPage(1);
        setPageSize(nextPageSize);
      }}
      page={page}
      pageSize={pageSize}
      totalPages={12}
    />
  );
}

export const Default: TStory = {
  args: {
    page: 2,
    pageSize: 25,
    totalPages: 12,
    onPageChange: () => undefined,
    onPageSizeChange: () => undefined,
  },
  render: () => {
    return <PaginationExample />;
  },
};
