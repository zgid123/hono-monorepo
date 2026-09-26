import { relations } from '@alphacifer/drizzle/core';
import { index, pgTable, text, timestamp, uuid } from '@alphacifer/drizzle/pg';
import { baseUuidSchema } from '@node/drizzle';

import { users } from './users';

export const accounts = pgTable(
  'accounts',
  {
    ...baseUuidSchema,
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
  },
  (table) => {
    return [index('account_userId_idx').on(table.userId)];
  },
);

export const accountsRelations = relations(accounts, ({ one }) => {
  return {
    user: one(users, {
      fields: [accounts.userId],
      references: [users.id],
    }),
  };
});
