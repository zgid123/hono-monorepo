import { Label } from '@react/shadcn-ui/components/label';
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@react/shadcn-ui/components/pagination';
import { cn } from '@react/shadcn-ui/lib/utils';
import type { JSX } from 'react';

import { Select } from '../Select';
import { createVisiblePaginationItems } from './utils';

export interface IPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  className?: string;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({
  page,
  pageSize,
  className,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: IPaginationProps): JSX.Element {
  const safeTotalPages = Math.max(1, totalPages);
  const currentPage = Math.min(Math.max(1, page), safeTotalPages);
  const paginationItems = createVisiblePaginationItems({
    page: currentPage,
    totalPages: safeTotalPages,
  });
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === safeTotalPages;

  return (
    <nav
      aria-label='Pagination'
      className={cn(
        'flex w-full flex-wrap items-center justify-between gap-6',
        className,
      )}
    >
      <Label
        className={cn(
          'flex items-center gap-3',
          'text-sm font-medium whitespace-nowrap',
        )}
      >
        <span>Rows per page</span>
        <Select
          aria-label='Rows per page'
          className={cn('min-w-24')}
          onValueChange={(value) => onPageSizeChange(Number(value))}
          options={pageSizeOptions.map((option) => {
            return {
              label: String(option),
              value: String(option),
            };
          })}
          value={String(pageSize)}
        />
      </Label>
      <PaginationContent className={cn('gap-1')}>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={isFirstPage}
            className={cn(isFirstPage && 'pointer-events-none opacity-50')}
            href='#'
            onClick={(event) => {
              event.preventDefault();

              if (!isFirstPage) {
                onPageChange(currentPage - 1);
              }
            }}
            tabIndex={isFirstPage ? -1 : undefined}
          />
        </PaginationItem>
        {paginationItems.map((item) => {
          if (typeof item === 'string') {
            return (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item}>
              <PaginationLink
                href='#'
                isActive={item === currentPage}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            aria-disabled={isLastPage}
            className={cn(isLastPage && 'pointer-events-none opacity-50')}
            href='#'
            onClick={(event) => {
              event.preventDefault();

              if (!isLastPage) {
                onPageChange(currentPage + 1);
              }
            }}
            tabIndex={isLastPage ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </nav>
  );
}
