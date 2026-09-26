import { type IQueryHandler, Query } from '@cqrsx/core';
import { type IUserRepository, type UserEntity, UserError } from '@domain/auth';

export interface IGetUserQueryParams {
  readonly userId: string;
}

export class GetUserQuery extends Query<UserEntity> {
  public readonly userId: string;

  public constructor({ userId }: IGetUserQueryParams) {
    super();

    this.userId = userId;
  }
}

export interface IGetUserQueryHandlerParams {
  readonly userRepository: IUserRepository;
}

export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, UserEntity>
{
  readonly #userRepository: IUserRepository;

  public constructor({ userRepository }: IGetUserQueryHandlerParams) {
    this.#userRepository = userRepository;
  }

  public async exec({ userId }: GetUserQuery): Promise<UserEntity> {
    const user = await this.#userRepository.findOne({
      id: userId,
    });

    if (!user) {
      throw UserError.notFound();
    }

    return user;
  }
}
