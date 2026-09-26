import {
  type ICreateParams,
  type IDrizzle,
  createDrizzle as init,
} from '@alphacifer/drizzle/factory';
import { testSchema } from '@alphacifer/drizzle/testing';

import { authSchema } from '#/modules/auth/infrastructure/drizzle/schemas';

export const schema = {
  ...authSchema,
} as const;

export type TDrizzle = IDrizzle<typeof schema>;

let cachedDrizzle: TDrizzle | undefined;

export function createDrizzle({
  client,
}: Pick<ICreateParams<typeof schema>, 'client'> = {}): TDrizzle {
  if (cachedDrizzle) {
    return cachedDrizzle;
  }

  const isTest = !!process.env.VITEST_WORKER_ID;

  if (isTest) {
    process.env.PGOPTIONS = `-c search_path=${testSchema}`;
  }

  cachedDrizzle = init({
    schema,
    client,
    isTest,
  });

  return cachedDrizzle;
}
