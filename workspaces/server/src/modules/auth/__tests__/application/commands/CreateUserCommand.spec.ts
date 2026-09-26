import { drizzle } from '#/infrastructure/drizzle/instance';

import {
  CreateUserCommand,
  CreateUserCommandHandler,
} from '../../../application/commands';
import { auth } from '../../../infrastructure/betterAuth/instance';
import { UserProvisioner } from '../../../infrastructure/betterAuth/services';
import { UserRepository } from '../../../infrastructure/drizzle/repositories/UserRepository';
import { userFactory } from '../../factories/drizzle/UserFactory';

describe('#CreateUserCommandHandler', () => {
  let subject: CreateUserCommandHandler;
  let userRepository: UserRepository;
  let userProvisioner: UserProvisioner;

  beforeEach(async () => {
    await userFactory.create();

    userRepository = new UserRepository({
      drizzle,
    });
    userProvisioner = new UserProvisioner({
      auth,
    });
    subject = new CreateUserCommandHandler({
      userProvisioner,
    });
  });

  suite('when user input is valid', () => {
    it('creates the user', async () => {
      await subject.exec(
        new CreateUserCommand({
          name: 'Alpha',
          email: 'alpha@example.com',
          password: 'ChangeMe123!',
          displayName: 'Alphacifer',
        }),
      );

      const result = await userRepository.list({
        page: 1,
        limit: 10,
      });

      expect(result.data).toContainEqual(
        expect.objectContaining({
          name: 'Alpha',
          email: 'alpha@example.com',
          image: null,
          status: 'active',
          displayName: 'Alphacifer',
        }),
      );
    }, 15_000);
  });
});
