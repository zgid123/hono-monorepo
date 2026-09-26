import type { TMetadata } from './schema';

export interface IResolvePagyResult extends Omit<TMetadata, 'total'> {
  offset: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function resolvePagy({
  page: pageInput,
  limit: limitInput,
}: Omit<TMetadata, 'total'>): IResolvePagyResult {
  const page = Math.max(
    1,
    Number.isInteger(pageInput) ? pageInput : DEFAULT_PAGE,
  );
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.isInteger(limitInput) ? limitInput : DEFAULT_LIMIT),
  );

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}
