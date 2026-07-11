import {
  type ICreateParams,
  type IDrizzle,
  createDrizzle as init,
} from '@alphacifer/drizzle/factory';

import { accounts, accountsRelations } from './schemas/accounts';
import { sessions, sessionsRelations } from './schemas/sessions';
import { users, usersRelations } from './schemas/users';
import { verifications } from './schemas/verifications';

export const schema = {
  users,
  sessions,
  accounts,
  verifications,
  usersRelations,
  sessionsRelations,
  accountsRelations,
} as const;

export type TDrizzle = IDrizzle<typeof schema>;

let cachedDrizzle: TDrizzle | undefined;

export function createDrizzle({
  client,
}: Pick<ICreateParams<typeof schema>, 'client'> = {}): TDrizzle {
  if (cachedDrizzle) {
    return cachedDrizzle;
  }

  cachedDrizzle = init({
    schema,
    client,
    isTest: !!process.env.VITEST_WORKER_ID,
  });

  return cachedDrizzle;
}
