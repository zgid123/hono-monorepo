import { drizzle } from '#/infrastructure/drizzle/instance';

import {
  ChangeUserRoleCommand,
  ChangeUserRoleCommandHandler,
} from '../../../application/commands';
import { UserRepository } from '../../../infrastructure/drizzle/repositories/UserRepository';
import type { TUser } from '../../../infrastructure/drizzle/schemas/users';
import { userFactory } from '../../factories/drizzle/UserFactory';

describe('#ChangeUserRoleCommandHandler', () => {
  let subject: ChangeUserRoleCommandHandler;
  let user: TUser;
  let userRepository: UserRepository;

  beforeEach(async () => {
    user = await userFactory.create();

    userRepository = new UserRepository({
      drizzle,
    });
    subject = new ChangeUserRoleCommandHandler({
      userRepository,
    });
  });

  suite('when the user exists', () => {
    it('changes and persists the role', async () => {
      await subject.exec(
        new ChangeUserRoleCommand({
          role: 'admin',
          userId: user.id,
        }),
      );

      const updatedUser = await userRepository.findOne({
        id: user.id,
      });

      expect(updatedUser?.role).toEqual('admin');
    });
  });
});
