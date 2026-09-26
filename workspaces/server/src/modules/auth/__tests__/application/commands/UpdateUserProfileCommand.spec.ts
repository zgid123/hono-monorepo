import {
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_NAME,
} from '@domain/auth/constants';

import { drizzle } from '#/infrastructure/drizzle/instance';

import {
  UpdateUserProfileCommand,
  UpdateUserProfileCommandHandler,
} from '../../../application/commands';
import { UserRepository } from '../../../infrastructure/drizzle/repositories/UserRepository';
import type { TUser } from '../../../infrastructure/drizzle/schemas/users';
import { userFactory } from '../../factories/drizzle/UserFactory';

describe('#UpdateUserProfileCommandHandler', () => {
  let subject: UpdateUserProfileCommandHandler;
  let user: TUser;
  let userRepository: UserRepository;

  beforeEach(async () => {
    user = await userFactory.create();

    userRepository = new UserRepository({
      drizzle,
    });
    subject = new UpdateUserProfileCommandHandler({
      userRepository,
    });
  });

  suite('when the user exists', () => {
    it('updates and persists the profile', async () => {
      await subject.exec(
        new UpdateUserProfileCommand({
          userId: user.id,
          name: 'Updated Name',
          displayName: 'Updated Display Name',
        }),
      );

      const updatedUser = await userRepository.findOne({
        id: user.id,
      });

      expect(updatedUser?.name).toEqual('Updated Name');
      expect(updatedUser?.displayName).toEqual('Updated Display Name');
    });
  });

  suite('when the user does not exist', () => {
    it('throws the user-not-found error', async () => {
      await expect(
        subject.exec(
          new UpdateUserProfileCommand({
            name: 'Updated Name',
            userId: '019c820f-5a60-7000-8000-000000000001',
          }),
        ),
      ).rejects.toMatchObject({
        httpCode: 404,
        name: USER_NOT_FOUND_NAME,
        code: USER_NOT_FOUND_CODE,
        message: USER_NOT_FOUND_MESSAGE,
      });
    });
  });
});
