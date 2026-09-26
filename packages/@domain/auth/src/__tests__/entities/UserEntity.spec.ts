import { UserEntity } from '../../entities';

function buildUser(): UserEntity {
  const date = new Date();

  return UserEntity.create({
    role: 'user',
    status: 'active',
    banReason: null,
    banExpires: null,
    name: 'Original Name',
    image: null,
    email: 'user@example.com',
    createdAt: date,
    updatedAt: date,
    displayName: null,
    emailVerified: false,
    id: '019c820f-5a60-7000-8000-000000000001',
  });
}

describe('#UserEntity', () => {
  describe('.create', () => {
    suite('when the domain state is valid', () => {
      it('creates an immutable entity', () => {
        expect(Object.isFrozen(buildUser())).toBe(true);
      });
    });

    suite('when the domain state is invalid', () => {
      it('rejects invalid domain state', () => {
        expect(() => {
          UserEntity.create({
            ...buildUser(),
            email: 'not-an-email',
          });
        }).toThrow();
      });
    });
  });

  describe('.updateProfile', () => {
    suite('when profile fields are supplied', () => {
      it('updates only the supplied profile fields', () => {
        const user = buildUser();

        const updatedUser = user.updateProfile({
          name: 'Updated Name',
          displayName: 'Updated Display Name',
        });

        expect(updatedUser.name).toEqual('Updated Name');
        expect(updatedUser.image).toBeNull();
        expect(updatedUser.displayName).toEqual('Updated Display Name');
        expect(user.name).toEqual('Original Name');
      });
    });
  });

  describe('.changeRole', () => {
    suite('when a different role is supplied', () => {
      it('changes the user role', () => {
        const user = buildUser();

        const updatedUser = user.changeRole({
          role: 'admin',
        });

        expect(updatedUser.role).toEqual('admin');
        expect(user.role).toEqual('user');
      });
    });
  });

  describe('.changeStatus', () => {
    suite('when a different status is supplied', () => {
      it('changes the user status', () => {
        const user = buildUser();

        const updatedUser = user.changeStatus({
          status: 'banned',
        });

        expect(updatedUser.status).toEqual('banned');
        expect(user.status).toEqual('active');
      });
    });
  });
});
