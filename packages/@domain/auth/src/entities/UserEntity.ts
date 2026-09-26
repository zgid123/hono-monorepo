import { BaseUuid } from '@domain/core';
import { type } from 'arktype';

const RoleValidation = type("'user' | 'admin'");
const UserStatusValidation = type("'active' | 'banned'");

export type TRole = typeof RoleValidation.infer;
export type TUserStatus = typeof UserStatusValidation.infer;

const UserStateValidation = BaseUuid.and({
  name: 'string',
  role: RoleValidation,
  email: 'string.email',
  image: 'string | null',
  emailVerified: 'boolean',
  banExpires: 'Date | null',
  banReason: 'string | null',
  displayName: 'string | null',
  status: UserStatusValidation,
});

export type TUser = typeof UserStateValidation.infer;

export interface IUpdateUserProfileParams {
  readonly name?: string;
  readonly image?: string | null;
  readonly displayName?: string | null;
}

export interface IChangeUserRoleParams {
  readonly role: TRole;
}

export interface IChangeUserStatusParams {
  readonly status: TUserStatus;
}

export class UserEntity {
  public readonly id: string;
  public readonly role: TRole;
  public readonly name: string;
  public readonly email: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly status: TUserStatus;
  public readonly image: string | null;
  public readonly emailVerified: boolean;
  public readonly banExpires: Date | null;
  public readonly banReason: string | null;
  public readonly displayName: string | null;

  private constructor({
    id,
    role,
    name,
    email,
    image,
    status,
    banReason,
    updatedAt,
    createdAt,
    banExpires,
    displayName,
    emailVerified,
  }: TUser) {
    this.id = id;
    this.role = role;
    this.name = name;
    this.email = email;
    this.image = image;
    this.status = status;
    this.banReason = banReason;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.banExpires = banExpires;
    this.displayName = displayName;
    this.emailVerified = emailVerified;

    Object.freeze(this);
  }

  public static create(props: TUser): UserEntity {
    const out = UserStateValidation(props);

    if (out instanceof type.errors) {
      throw out;
    }

    return new UserEntity(out);
  }

  public updateProfile({
    name,
    image,
    displayName,
  }: IUpdateUserProfileParams): UserEntity {
    return UserEntity.create({
      ...this,
      updatedAt: new Date(),
      name: name ?? this.name,
      image: image === undefined ? this.image : image,
      displayName: displayName === undefined ? this.displayName : displayName,
    });
  }

  public changeRole({ role }: IChangeUserRoleParams): UserEntity {
    return UserEntity.create({
      ...this,
      role,
      updatedAt: new Date(),
    });
  }

  public changeStatus({ status }: IChangeUserStatusParams): UserEntity {
    return UserEntity.create({
      ...this,
      status,
      updatedAt: new Date(),
      banReason: status === 'active' ? null : this.banReason,
      banExpires: status === 'active' ? null : this.banExpires,
    });
  }
}
