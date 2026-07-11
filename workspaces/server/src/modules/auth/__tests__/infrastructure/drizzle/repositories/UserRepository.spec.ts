import { drizzle } from '#/infrastructure/drizzle/instance';

import { UserRepository } from '../../../../infrastructure/drizzle/repositories/UserRepository';
import { userFactory } from '../../../factories/drizzle/UserFactory';

describe('#UserRepository', () => {
  describe('.list', () => {
    suite('when the database has users', () => {
      it('maps database records to user entities', async () => {
        const user = await userFactory.create();
        const repository = new UserRepository({
          drizzle,
        });

        const result = await repository.list();

        expect(result).toContainEqual(
          expect.objectContaining({
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }),
        );
      });
    });
  });
});
