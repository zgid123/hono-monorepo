import { eq } from '@alphacifer/drizzle/core';
import {
  type IFindOneUserParams,
  type IListUsersParams,
  type IListUsersResult,
  type IUserEntityParams,
  type IUserRepository,
  UserEntity,
} from '@domain/auth';

import type { TDrizzle } from '#/infrastructure/drizzle/config';

import { sessions } from '../schemas/sessions';
import { users } from '../schemas/users';

export interface IUserRepositoryParams {
  drizzle: TDrizzle;
}

export class UserRepository implements IUserRepository {
  readonly #drizzle: TDrizzle;

  public constructor({ drizzle }: IUserRepositoryParams) {
    this.#drizzle = drizzle;
  }

  public async list({
    page,
    limit,
  }: IListUsersParams): Promise<IListUsersResult> {
    const offset = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.#drizzle.query.users.findMany({
        limit,
        offset,
        orderBy: (table, { desc }) => {
          return desc(table.createdAt);
        },
      }),
      this.#drizzle.$count(users),
    ]);

    return {
      data: records.map((record) => {
        return UserEntity.create({
          ...record,
          status: record.banned ? 'banned' : 'active',
        });
      }),
      total,
    };
  }

  public async findOne({ id }: IFindOneUserParams): Promise<UserEntity | null> {
    const record = await this.#drizzle.query.users.findFirst({
      where: (table, { eq: equals }) => {
        return equals(table.id, id);
      },
    });

    if (!record) {
      return null;
    }

    return UserEntity.create({
      ...record,
      status: record.banned ? 'banned' : 'active',
    });
  }

  public async updateProfile({ user }: IUserEntityParams): Promise<void> {
    await this.#drizzle
      .update(users)
      .set({
        name: user.name,
        image: user.image,
        updatedAt: user.updatedAt,
        displayName: user.displayName,
      })
      .where(eq(users.id, user.id));
  }

  public async changeRole({ user }: IUserEntityParams): Promise<void> {
    await this.#drizzle
      .update(users)
      .set({
        role: user.role,
        updatedAt: user.updatedAt,
      })
      .where(eq(users.id, user.id));
  }

  public async changeStatus({ user }: IUserEntityParams): Promise<void> {
    await this.#drizzle.transaction(async (transaction) => {
      await transaction
        .update(users)
        .set({
          banReason: user.banReason,
          updatedAt: user.updatedAt,
          banExpires: user.banExpires,
          banned: user.status === 'banned',
        })
        .where(eq(users.id, user.id));

      if (user.status === 'banned') {
        await transaction.delete(sessions).where(eq(sessions.userId, user.id));
      }
    });
  }
}
