import type { TMetadata } from '@core/utils';
import { type IQueryHandler, Query } from '@cqrsx/core';
import type { IUserRepository, UserEntity } from '@domain/auth';

export interface IListUsersQueryResult {
  readonly data: UserEntity[];
  readonly metadata: TMetadata;
}

export interface IListUsersQueryParams {
  readonly page: number;
  readonly limit: number;
}

export class ListUsersQuery extends Query<IListUsersQueryResult> {
  public readonly page: number;
  public readonly limit: number;

  public constructor({ page, limit }: IListUsersQueryParams) {
    super();

    this.page = page;
    this.limit = limit;
  }
}

export interface IListUsersQueryHandlerParams {
  readonly userRepository: IUserRepository;
}

export class ListUsersQueryHandler
  implements IQueryHandler<ListUsersQuery, IListUsersQueryResult>
{
  readonly #userRepository: IUserRepository;

  public constructor({ userRepository }: IListUsersQueryHandlerParams) {
    this.#userRepository = userRepository;
  }

  public async exec({
    page,
    limit,
  }: ListUsersQuery): Promise<IListUsersQueryResult> {
    const result = await this.#userRepository.list({
      page,
      limit,
    });

    return {
      data: result.data,
      metadata: {
        page,
        limit,
        total: result.total,
      },
    };
  }
}
