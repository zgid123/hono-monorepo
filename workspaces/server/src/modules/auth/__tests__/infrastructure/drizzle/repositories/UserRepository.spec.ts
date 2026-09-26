import { drizzle } from '#/infrastructure/drizzle/instance';

import { UserRepository } from '../../../../infrastructure/drizzle/repositories/UserRepository';
import type { TUser } from '../../../../infrastructure/drizzle/schemas/users';
import { userFactory } from '../../../factories/drizzle/UserFactory';

describe('#UserRepository', () => {
  let subject: UserRepository;
  let user: TUser;

  beforeEach(async () => {
    user = await userFactory.create({
      email: 'existing@example.com',
    });

    subject = new UserRepository({
      drizzle,
    });
  });

  describe('.list', () => {
    suite('when the database has users', () => {
      it('maps database records to user entities', async () => {
        const result = await subject.list({
          page: 1,
          limit: 10,
        });

        expect(result.data).toContainEqual(
          expect.objectContaining({
            id: user.id,
            role: user.role,
            name: user.name,
            status: 'active',
            email: user.email,
            image: user.image,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }),
        );
        expect(result.total).toEqual(expect.any(Number));
        expect(result.total).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('.findOne', () => {
    suite('when the user exists', () => {
      it('returns the mapped user entity', async () => {
        const result = await subject.findOne({
          id: user.id,
        });

        expect(result).toEqual(
          expect.objectContaining({
            id: user.id,
            email: user.email,
            status: 'active',
          }),
        );
      });
    });
  });

  describe('operation-specific updates', () => {
    it('persists profile changes', async () => {
      const entity = await subject.findOne({
        id: user.id,
      });

      if (!entity) {
        throw new Error('Expected user fixture to exist');
      }

      await subject.updateProfile({
        user: entity.updateProfile({
          name: 'Updated Name',
          displayName: 'Updated Display Name',
        }),
      });

      await expect(
        subject.findOne({
          id: user.id,
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          name: 'Updated Name',
          displayName: 'Updated Display Name',
        }),
      );
    });

    it('preserves changes made by other operations using an older entity', async () => {
      const entity = await subject.findOne({
        id: user.id,
      });

      if (!entity) {
        throw new Error('Expected user fixture to exist');
      }

      await subject.changeRole({
        user: entity.changeRole({
          role: 'admin',
        }),
      });
      await subject.changeStatus({
        user: entity.changeStatus({
          status: 'banned',
        }),
      });
      await subject.updateProfile({
        user: entity.updateProfile({
          name: 'Updated Name',
        }),
      });

      await expect(
        subject.findOne({
          id: user.id,
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          role: 'admin',
          status: 'banned',
          name: 'Updated Name',
        }),
      );
    });

    it('persists a banned status', async () => {
      const entity = await subject.findOne({
        id: user.id,
      });

      if (!entity) {
        throw new Error('Expected user fixture to exist');
      }

      await subject.changeStatus({
        user: entity.changeStatus({
          status: 'banned',
        }),
      });

      await expect(
        subject.findOne({
          id: user.id,
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          id: user.id,
          status: 'banned',
        }),
      );
    });
  });
});
