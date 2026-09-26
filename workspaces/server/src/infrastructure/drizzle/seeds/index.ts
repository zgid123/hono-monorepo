import { seed as authSeed } from '#/modules/auth/infrastructure/drizzle/seeds';

import type { TDrizzle } from '../config';

export async function seed(drizzle: TDrizzle): Promise<void> {
  await authSeed(drizzle);
}
