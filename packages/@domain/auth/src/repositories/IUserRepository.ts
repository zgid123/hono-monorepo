import type { UserEntity } from '../entities';

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

export interface IUserRepository {
  updateProfile(params: IUserEntityParams): Promise<void>;
  changeRole(params: IUserEntityParams): Promise<void>;
  changeStatus(params: IUserEntityParams): Promise<void>;
  list(params: IListUsersParams): Promise<IListUsersResult>;
  findOne(params: IFindOneUserParams): Promise<UserEntity | null>;
}
