import { drizzle } from '#/infrastructure/drizzle/instance';

import {
  ListUsersQuery,
  ListUsersQueryHandler,
} from '../../../application/queries/ListUsersQuery';
import { UserRepository } from '../../../infrastructure/drizzle/repositories/UserRepository';
import { userFactory } from '../../factories/drizzle/UserFactory';

describe('#ListUsersQueryHandler', () => {
  suite('when the database has users', () => {
    it('returns users from the repository', async () => {
      const user = await userFactory.create();

      const handler = new ListUsersQueryHandler({
        userRepository: new UserRepository({
          drizzle,
        }),
      });

      const result = await handler.exec(new ListUsersQuery());

      expect(result).toContainEqual(
        expect.objectContaining({
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          displayName: user.displayName,
        }),
      );
    });
  });
});
