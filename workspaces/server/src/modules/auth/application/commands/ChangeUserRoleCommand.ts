import { Command, type ICommandHandler } from '@cqrsx/core';
import { type IUserRepository, type TRole, UserError } from '@domain/auth';

export interface IChangeUserRoleCommandParams {
  readonly role: TRole;
  readonly userId: string;
}

export class ChangeUserRoleCommand extends Command {
  public readonly role: TRole;
  public readonly userId: string;

  public constructor({ userId, role }: IChangeUserRoleCommandParams) {
    super();

    this.role = role;
    this.userId = userId;
  }
}

export interface IChangeUserRoleCommandHandlerParams {
  readonly userRepository: IUserRepository;
}

export class ChangeUserRoleCommandHandler
  implements ICommandHandler<ChangeUserRoleCommand>
{
  readonly #userRepository: IUserRepository;

  public constructor({ userRepository }: IChangeUserRoleCommandHandlerParams) {
    this.#userRepository = userRepository;
  }

  public async exec({ userId, role }: ChangeUserRoleCommand): Promise<void> {
    const user = await this.#userRepository.findOne({
      id: userId,
    });

    if (!user) {
      throw UserError.notFound();
    }

    const updatedUser = user.changeRole({
      role,
    });

    await this.#userRepository.changeRole({
      user: updatedUser,
    });
  }
}
