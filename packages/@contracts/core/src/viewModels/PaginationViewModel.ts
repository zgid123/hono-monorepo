import { type } from 'arktype';

export const PaginationViewModel = type({
  page: 'number',
  limit: 'number',
  total: 'number',
  totalPages: 'number',
});

export type TPaginationViewModel = typeof PaginationViewModel.infer;
