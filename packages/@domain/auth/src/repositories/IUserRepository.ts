import type { UserEntity } from '../entities';

export interface IUserRepository {
  list(): Promise<UserEntity[]>;
}
