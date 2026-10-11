import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@react/shadcn-ui/components/table';
import { cn } from '@react/shadcn-ui/lib/utils';
import {
  type ColumnDef,
  columnVisibilityFeature,
  createPaginatedRowModel,
  flexRender,
  type PaginationState,
  type RowData,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { type JSX, useState } from 'react';

import { type IPaginationLabels, Pagination } from '../Pagination';

const dataTableFeatures = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export type TDataTableColumnDef<TData extends RowData> = ColumnDef<
  typeof dataTableFeatures,
  TData,
  unknown
>;

export interface IDataTableProps<TData extends RowData> {
  data: TData[];
  className?: string;
  totalPages?: number;
  emptyMessage?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  pagination?: IDataTablePagination;
  paginationLabels: IPaginationLabels;
  columns: TDataTableColumnDef<TData>[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface IDataTablePagination {
  page: number;
  pageSize: number;
}

export function DataTable<TData extends RowData>({
  data,
  columns,
  className,
  totalPages,
  onPageChange,
  onPageSizeChange,
  paginationLabels,
  initialPageSize = 10,
  pagination: controlledPagination,
  emptyMessage = 'No results found.',
  pageSizeOptions = [10, 25, 50, 100],
}: IDataTableProps<TData>): JSX.Element {
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: initialPageSize,
    },
  );
  const pagination = controlledPagination
    ? {
        pageIndex: controlledPagination.page - 1,
        pageSize: controlledPagination.pageSize,
      }
    : internalPagination;
  const isServerPaginated = controlledPagination !== undefined;
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    manualPagination: isServerPaginated,
    pageCount: totalPages,
    state: {
      pagination,
    },
  });
  const rows = table.getRowModel().rows;

  const handlePageChange = (page: number): void => {
    if (isServerPaginated) {
      onPageChange?.(page);
      return;
    }

    setInternalPagination({
      pageIndex: page - 1,
      pageSize: pagination.pageSize,
    });
  };

  const handlePageSizeChange = (pageSize: number): void => {
    if (isServerPaginated) {
      onPageSizeChange?.(pageSize);
      return;
    }

    setInternalPagination({
      pageIndex: 0,
      pageSize,
    });
  };

  return (
    <div
      className={cn(
        'overflow-hidden',
        'rounded-xl border border-stroke-primary',
        'bg-secondary',
        className,
      )}
    >
      <Table>
        <TableHeader
          className={cn('bg-tertiary/50', 'text-foreground-secondary')}
        >
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className={cn('px-4 py-3')} key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell className={cn('px-4 py-3')} key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                className={cn('h-24', 'text-center text-foreground-tertiary')}
                colSpan={columns.length}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        className={cn('px-4 py-3', 'border-t')}
        labels={paginationLabels}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        page={pagination.pageIndex + 1}
        pageSize={pagination.pageSize}
        pageSizeOptions={pageSizeOptions}
        totalPages={totalPages ?? table.getPageCount()}
      />
    </div>
  );
}
