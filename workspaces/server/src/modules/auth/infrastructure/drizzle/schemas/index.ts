import { accounts, accountsRelations } from './accounts';
import { sessions, sessionsRelations } from './sessions';
import { users, usersRelations } from './users';
import { verifications } from './verifications';

export const authSchema = {
  users,
  sessions,
  accounts,
  verifications,
  usersRelations,
  sessionsRelations,
  accountsRelations,
} as const;
