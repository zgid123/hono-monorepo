import { passwordHash } from '@alphacifer/authkit/hash';

import { env } from '#/infrastructure/common/env';
import type { TDrizzle } from '#/infrastructure/drizzle/config';

import { accounts } from '../schemas/accounts';
import { users } from '../schemas/users';

export async function createUsers(drizzle: TDrizzle): Promise<void> {
  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      'ADMIN_EMAIL or ADMIN_PASSWORD is not set. Skipping Admin User creation.',
    );

    return;
  }

  const hashedPassword = await passwordHash({
    password: adminPassword,
  });

  await drizzle.transaction(async (transaction) => {
    const [insertedUser] = await transaction
      .insert(users)
      .values({
        role: 'admin',
        displayName: 'Alpha',
        name: 'Alpha Lucifer',
        email: adminEmail.toLowerCase().trim(),
      })
      .onConflictDoNothing({
        target: users.email,
      })
      .returning();

    if (insertedUser) {
      await transaction.insert(accounts).values({
        userId: insertedUser.id,
        providerId: 'credential',
        password: hashedPassword,
        accountId: insertedUser.id,
      });
    }
  });
}
