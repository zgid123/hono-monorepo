import { USER_PASSWORD_MAX_LENGTH } from '@contracts/auth';
import {
  USER_ALREADY_EXISTS_CODE,
  USER_ALREADY_EXISTS_NAME,
} from '@domain/auth/constants';

import { drizzle } from '#/infrastructure/drizzle/instance';

import { auth } from '../../../../infrastructure/betterAuth/instance';
import { UserProvisioner } from '../../../../infrastructure/betterAuth/services';
import { userFactory } from '../../../factories/drizzle/UserFactory';

describe('#UserProvisioner', () => {
  const subject = new UserProvisioner({ auth });

  it('creates a credential account without creating a session', async () => {
    await subject.create({
      name: 'Created User',
      email: ' Created@Example.com ',
      password: 'ChangeMe123!',
      displayName: 'Created',
    });

    const createdUser = await drizzle.query.users.findFirst({
      where: (table, { eq }) => {
        return eq(table.email, 'created@example.com');
      },
      with: {
        accounts: true,
        sessions: true,
      },
    });

    expect(createdUser).toEqual(
      expect.objectContaining({
        email: 'created@example.com',
        name: 'Created User',
        displayName: 'Created',
        accounts: [
          expect.objectContaining({
            providerId: 'credential',
          }),
        ],
        sessions: [],
      }),
    );
  });

  it('maps a duplicate email to the existing user error', async () => {
    await userFactory.create({
      email: 'existing@example.com',
    });

    await expect(
      subject.create({
        name: 'Existing User',
        email: ' Existing@Example.com ',
        password: 'ChangeMe123!',
      }),
    ).rejects.toMatchObject({
      httpCode: 409,
      name: USER_ALREADY_EXISTS_NAME,
      code: USER_ALREADY_EXISTS_CODE,
      message: 'A user with email existing@example.com already exists',
    });
  });

  it('maps Better Auth validation errors to a client error', async () => {
    await expect(
      subject.create({
        name: 'Invalid User',
        email: 'invalid@example.com',
        password: 'x'.repeat(USER_PASSWORD_MAX_LENGTH + 1),
      }),
    ).rejects.toMatchObject({
      httpCode: 400,
      name: 'INVALID_USER_PROVISIONING_INPUT',
    });
  });
});
