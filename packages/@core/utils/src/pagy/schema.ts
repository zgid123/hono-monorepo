import { type } from 'arktype';

export const Metadata = type({
  page: 'number',
  limit: 'number',
  total: 'number',
});

export type TMetadata = typeof Metadata.infer;
