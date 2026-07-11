import { type IQueryHandler, Query } from '@cqrsx/core';
import type { IUserRepository, UserEntity } from '@domain/auth';

export class ListUsersQuery extends Query<UserEntity[]> {}

export interface IListUsersQueryHandlerParams {
  readonly userRepository: IUserRepository;
}

export class ListUsersQueryHandler
  implements IQueryHandler<ListUsersQuery, UserEntity[]>
{
  readonly #userRepository: IUserRepository;

  public constructor({ userRepository }: IListUsersQueryHandlerParams) {
    this.#userRepository = userRepository;
  }

  public async exec(_query: ListUsersQuery): Promise<UserEntity[]> {
    return this.#userRepository.list();
  }
}
