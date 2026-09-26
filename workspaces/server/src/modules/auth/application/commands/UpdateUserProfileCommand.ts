import { Command, type ICommandHandler } from '@cqrsx/core';
import { type IUserRepository, UserError } from '@domain/auth';

export interface IUpdateUserProfileCommandParams {
  readonly name?: string;
  readonly userId: string;
  readonly image?: string | null;
  readonly displayName?: string | null;
}

export class UpdateUserProfileCommand extends Command {
  public readonly name?: string;
  public readonly userId: string;
  public readonly image?: string | null;
  public readonly displayName?: string | null;

  public constructor({
    name,
    image,
    userId,
    displayName,
  }: IUpdateUserProfileCommandParams) {
    super();

    this.name = name;
    this.image = image;
    this.userId = userId;
    this.displayName = displayName;
  }
}

export interface IUpdateUserProfileCommandHandlerParams {
  readonly userRepository: IUserRepository;
}

export class UpdateUserProfileCommandHandler
  implements ICommandHandler<UpdateUserProfileCommand>
{
  readonly #userRepository: IUserRepository;

  public constructor({
    userRepository,
  }: IUpdateUserProfileCommandHandlerParams) {
    this.#userRepository = userRepository;
  }

  public async exec(command: UpdateUserProfileCommand): Promise<void> {
    const { name, image, userId, displayName } = command;

    const user = await this.#userRepository.findOne({
      id: userId,
    });

    if (!user) {
      throw UserError.notFound();
    }

    const updatedUser = user.updateProfile({
      name,
      image,
      displayName,
    });

    await this.#userRepository.updateProfile({
      user: updatedUser,
    });
  }
}
