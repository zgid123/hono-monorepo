import { type IUserRepository, UserEntity } from '@domain/auth';

import type { TDrizzle } from '#/infrastructure/drizzle/config';

export interface IUserRepositoryParams {
  readonly drizzle: TDrizzle;
}

export class UserRepository implements IUserRepository {
  readonly #drizzle: TDrizzle;

  public constructor({ drizzle }: IUserRepositoryParams) {
    this.#drizzle = drizzle;
  }

  public async list(): Promise<UserEntity[]> {
    const records = await this.#drizzle.query.users.findMany();

    return records.map((record) => {
      return UserEntity.create(record);
    });
  }
}
