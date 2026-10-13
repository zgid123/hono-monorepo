import type { IUpdateUserProfileParams, UserEntity } from '../entities';

export interface IFindOneUserParams {
  readonly id: string;
}

export interface IListUsersParams {
  readonly page: number;
  readonly limit: number;
}

export interface IListUsersResult {
  readonly total: number;
  readonly data: UserEntity[];
}

export interface IUserEntityParams {
  readonly user: UserEntity;
}

export interface IUpdateUserProfileRepositoryParams extends IUserEntityParams {
  readonly fields: readonly (keyof IUpdateUserProfileParams)[];
}

export interface IUserRepository {
  changeRole(params: IUserEntityParams): Promise<void>;
  changeStatus(params: IUserEntityParams): Promise<void>;
  list(params: IListUsersParams): Promise<IListUsersResult>;
  findOne(params: IFindOneUserParams): Promise<UserEntity | null>;
  updateProfile(params: IUpdateUserProfileRepositoryParams): Promise<void>;
}
