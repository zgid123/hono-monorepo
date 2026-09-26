import { drizzle } from '#/infrastructure/drizzle/instance';

import {
  ListUsersQuery,
  ListUsersQueryHandler,
} from '../../../application/queries';
import { UserRepository } from '../../../infrastructure/drizzle/repositories/UserRepository';
import type { TUser } from '../../../infrastructure/drizzle/schemas/users';
import { userFactory } from '../../factories/drizzle/UserFactory';

describe('#ListUsersQueryHandler', () => {
  let subject: ListUsersQueryHandler;
  let user: TUser;

  beforeEach(async () => {
    user = await userFactory.create();

    subject = new ListUsersQueryHandler({
      userRepository: new UserRepository({
        drizzle,
      }),
    });
  });

  suite('when users exist', () => {
    it('returns the requested page from the query reader', async () => {
      const result = await subject.exec(
        new ListUsersQuery({
          page: 1,
          limit: 10,
        }),
      );

      expect(result).toEqual({
        data: [
          expect.objectContaining({
            id: user.id,
            email: user.email,
          }),
        ],
        metadata: {
          page: 1,
          limit: 10,
          total: 1,
        },
      });
    });
  });
});
