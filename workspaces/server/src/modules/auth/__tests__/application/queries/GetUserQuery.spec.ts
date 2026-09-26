import {
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_NAME,
} from '@domain/auth/constants';

import { drizzle } from '#/infrastructure/drizzle/instance';

import {
  GetUserQuery,
  GetUserQueryHandler,
} from '../../../application/queries';
import { UserRepository } from '../../../infrastructure/drizzle/repositories/UserRepository';
import type { TUser } from '../../../infrastructure/drizzle/schemas/users';
import { userFactory } from '../../factories/drizzle/UserFactory';

describe('#GetUserQueryHandler', () => {
  let subject: GetUserQueryHandler;
  let user: TUser;

  beforeEach(async () => {
    user = await userFactory.create();

    subject = new GetUserQueryHandler({
      userRepository: new UserRepository({
        drizzle,
      }),
    });
  });

  suite('when the user exists', () => {
    it('returns the user', async () => {
      const result = await subject.exec(
        new GetUserQuery({
          userId: user.id,
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          id: user.id,
          email: user.email,
        }),
      );
    });
  });

  suite('when the user does not exist', () => {
    it('throws the user-not-found error', async () => {
      await expect(
        subject.exec(
          new GetUserQuery({
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
