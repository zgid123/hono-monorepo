import { Command, type ICommandHandler } from '@cqrsx/core';
import type { IUserProvisioner } from '@domain/auth';

export interface ICreateUserCommandParams {
  readonly name: string;
  readonly email: string;
  readonly image?: string;
  readonly password: string;
  readonly displayName?: string;
}

export class CreateUserCommand extends Command {
  public readonly name: string;
  public readonly email: string;
  public readonly image?: string;
  public readonly password: string;
  public readonly displayName?: string;

  public constructor({
    name,
    email,
    image,
    password,
    displayName,
  }: ICreateUserCommandParams) {
    super();

    this.name = name;
    this.email = email;
    this.image = image;
    this.password = password;
    this.displayName = displayName;
  }
}

export interface ICreateUserCommandHandlerParams {
  readonly userProvisioner: IUserProvisioner;
}

export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  readonly #userProvisioner: IUserProvisioner;

  public constructor({ userProvisioner }: ICreateUserCommandHandlerParams) {
    this.#userProvisioner = userProvisioner;
  }

  public async exec(command: CreateUserCommand): Promise<void> {
    const { name, email, image, password, displayName } = command;

    await this.#userProvisioner.create({
      name,
      email,
      image,
      password,
      displayName,
    });
  }
}
