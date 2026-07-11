import { relations } from '@alphacifer/drizzle/core';
import { boolean, pgTable, text, varchar } from '@alphacifer/drizzle/pg';
import type { TRole } from '@domain/auth';
import { baseUuidSchema } from '@node/drizzle';

import { accounts } from './accounts';
import { sessions } from './sessions';

export const users = pgTable('users', {
  ...baseUuidSchema,
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  displayName: varchar(),
  role: varchar().notNull().$type<TRole>().default('user'),
});

export const usersRelations = relations(users, ({ many }) => {
  return {
    sessions: many(sessions),
    accounts: many(accounts),
  };
});

export type TUser = typeof users.$inferSelect;

export type TNewUser = typeof users.$inferInsert;
