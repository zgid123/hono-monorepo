import type { TDrizzle } from '../config';
import { createUsers } from './20260710172706_CreateUsers_Seed';

export async function seed(drizzle: TDrizzle): Promise<void> {
  await createUsers(drizzle);
}
