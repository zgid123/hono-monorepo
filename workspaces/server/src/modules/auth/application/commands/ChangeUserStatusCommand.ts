import { Command, type ICommandHandler } from '@cqrsx/core';
import {
  type IUserRepository,
  type TUserStatus,
  UserError,
} from '@domain/auth';

export interface IChangeUserStatusCommandParams {
  readonly userId: string;
  readonly currentUserId: string;
  readonly status: TUserStatus;
}

export class ChangeUserStatusCommand extends Command {
  public readonly userId: string;
  public readonly status: TUserStatus;
  public readonly currentUserId: string;

  public constructor({
    userId,
    status,
    currentUserId,
  }: IChangeUserStatusCommandParams) {
    super();

    this.userId = userId;
    this.status = status;
    this.currentUserId = currentUserId;
  }
}

export interface IChangeUserStatusCommandHandlerParams {
  readonly userRepository: IUserRepository;
}

export class ChangeUserStatusCommandHandler
  implements ICommandHandler<ChangeUserStatusCommand>
{
  readonly #userRepository: IUserRepository;

  public constructor({
    userRepository,
  }: IChangeUserStatusCommandHandlerParams) {
    this.#userRepository = userRepository;
  }

  public async exec({
    userId,
    currentUserId,
    status,
  }: ChangeUserStatusCommand): Promise<void> {
    if (status === 'banned' && userId === currentUserId) {
      throw UserError.cannotBanCurrentUser();
    }

    const user = await this.#userRepository.findOne({
      id: userId,
    });

    if (!user) {
      throw UserError.notFound();
    }

    await this.#userRepository.changeStatus({
      user: user.changeStatus({
        status,
      }),
    });
  }
}
