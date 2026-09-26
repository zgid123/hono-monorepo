import { index, pgTable, text, timestamp } from '@alphacifer/drizzle/pg';
import { baseUuidSchema } from '@node/drizzle';

export const verifications = pgTable(
  'verifications',
  {
    ...baseUuidSchema,
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (table) => {
    return [index('verification_identifier_idx').on(table.identifier)];
  },
);
