import { relations } from '@alphacifer/drizzle/core';
import { index, pgTable, text, timestamp, uuid } from '@alphacifer/drizzle/pg';
import { baseUuidSchema } from '@node/drizzle';

import { users } from './users';

export const sessions = pgTable(
  'sessions',
  {
    ...baseUuidSchema,
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return [index('session_userId_idx').on(table.userId)];
  },
);

export const sessionsRelations = relations(sessions, ({ one }) => {
  return {
    user: one(users, {
      fields: [sessions.userId],
      references: [users.id],
    }),
  };
});
