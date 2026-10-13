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
            email: user.email,
            image: user.image,
            status: 'active',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
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
    suite('when profile fields are supplied', () => {
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
          fields: ['name', 'displayName'],
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
    });

    suite('when another operation has changed the user', () => {
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
          fields: ['name'],
        });

        await expect(
          subject.findOne({
            id: user.id,
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            role: 'admin',
            name: 'Updated Name',
            status: 'banned',
          }),
        );
      });
    });

    suite('when concurrent updates change different profile fields', () => {
      it('preserves concurrent profile changes loaded from the same state', async () => {
        const entity = await subject.findOne({
          id: user.id,
        });

        if (!entity) {
          throw new Error('Expected user fixture to exist');
        }

        await Promise.all([
          subject.updateProfile({
            user: entity.updateProfile({
              name: 'Concurrent Name',
            }),
            fields: ['name'],
          }),
          subject.updateProfile({
            user: entity.updateProfile({
              image: 'https://example.com/avatar.png',
            }),
            fields: ['image'],
          }),
        ]);

        await expect(
          subject.findOne({
            id: user.id,
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            name: 'Concurrent Name',
            image: 'https://example.com/avatar.png',
          }),
        );
      });
    });

    suite('when a nullable profile field is explicitly cleared', () => {
      it('clears explicitly supplied nullable fields without replacing omitted fields', async () => {
        const entity = await subject.findOne({
          id: user.id,
        });

        if (!entity) {
          throw new Error('Expected user fixture to exist');
        }

        await subject.updateProfile({
          user: entity.updateProfile({
            image: 'https://example.com/avatar.png',
          }),
          fields: ['image'],
        });
        await subject.updateProfile({
          user: entity.updateProfile({
            image: null,
          }),
          fields: ['image'],
        });

        await expect(
          subject.findOne({
            id: user.id,
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            name: user.name,
            image: null,
          }),
        );
      });
    });

    suite('when the user is banned', () => {
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
});
