import {
  CANNOT_BAN_CURRENT_USER_CODE,
  CANNOT_BAN_CURRENT_USER_MESSAGE,
  CANNOT_BAN_CURRENT_USER_NAME,
} from '@domain/auth/constants';

import { drizzle } from '#/infrastructure/drizzle/instance';

import {
  ChangeUserStatusCommand,
  ChangeUserStatusCommandHandler,
} from '../../../application/commands';
import { UserRepository } from '../../../infrastructure/drizzle/repositories/UserRepository';
import type { TUser } from '../../../infrastructure/drizzle/schemas/users';
import { userFactory } from '../../factories/drizzle/UserFactory';

describe('#ChangeUserStatusCommandHandler', () => {
  let subject: ChangeUserStatusCommandHandler;
  let user: TUser;
  let userRepository: UserRepository;

  beforeEach(async () => {
    user = await userFactory.create();

    userRepository = new UserRepository({
      drizzle,
    });
    subject = new ChangeUserStatusCommandHandler({
      userRepository,
    });
  });

  suite('when an administrator bans another user', () => {
    it('changes and persists the user status', async () => {
      await subject.exec(
        new ChangeUserStatusCommand({
          userId: user.id,
          status: 'banned',
          currentUserId: '019c820f-5a60-7000-8000-000000000001',
        }),
      );

      await expect(
        userRepository.findOne({
          id: user.id,
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          status: 'banned',
        }),
      );
    });
  });

  suite('when an administrator bans themselves', () => {
    it('throws the cannot-ban-current-user error', async () => {
      await expect(
        subject.exec(
          new ChangeUserStatusCommand({
            userId: user.id,
            status: 'banned',
            currentUserId: user.id,
          }),
        ),
      ).rejects.toMatchObject({
        httpCode: 409,
        name: CANNOT_BAN_CURRENT_USER_NAME,
        code: CANNOT_BAN_CURRENT_USER_CODE,
        message: CANNOT_BAN_CURRENT_USER_MESSAGE,
      });
    });
  });
});
