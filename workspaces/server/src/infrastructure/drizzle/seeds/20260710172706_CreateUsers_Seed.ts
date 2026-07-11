import { passwordHash } from '@alphacifer/authkit/hash';

import { env } from '../../common/env';
import type { TDrizzle } from '../config';
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

  const [insertedUser] = await drizzle
    .insert(users)
    .values({
      role: 'admin',
      email: adminEmail,
      displayName: 'Alpha',
      name: 'Alpha Lucifer',
    })
    .onConflictDoNothing({
      target: users.email,
    })
    .returning();

  if (insertedUser) {
    const crypto = await import('node:crypto');
    await drizzle.insert(accounts).values({
      id: crypto.randomUUID(),
      userId: insertedUser.id,
      providerId: 'credential',
      password: hashedPassword,
      accountId: insertedUser.email,
    });
  }
}
