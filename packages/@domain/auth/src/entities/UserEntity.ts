import { type } from 'arktype';

import { type TRole, type TUser, User as UserSchema } from '../schemas';

export class UserEntity {
  public readonly id: string;
  public readonly role: TRole;
  public readonly name: string;
  public readonly email: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly displayName: string | null;

  private constructor({
    id,
    role,
    name,
    email,
    updatedAt,
    createdAt,
    displayName,
  }: TUser) {
    this.id = id;
    this.role = role;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.displayName = displayName;
  }

  public static create(props: TUser): UserEntity {
    const out = UserSchema(props);

    if (out instanceof type.errors) {
      throw out;
    }

    return new UserEntity(out);
  }
}
