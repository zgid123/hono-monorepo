import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { drizzle } from '#/infrastructure/drizzle/instance';
import { type TUser, users } from '#/infrastructure/drizzle/schemas/users';

export const userFactory = Factory.define<TUser>(({ params, onCreate }) => {
  onCreate(async (user) => {
    const [createdUser] = await drizzle.insert(users).values(user).returning();

    if (!createdUser) {
      throw new Error('Failed to create a user fixture');
    }

    return createdUser;
  });

  const {
    id = faker.string.uuid({
      version: 7,
    }),
    name = faker.person.fullName(),
    email = faker.internet.email(),
    emailVerified = false,
    image = null,
    displayName = null,
    role = 'user',
    createdAt = new Date(),
    updatedAt = new Date(),
    ...user
  } = params;

  return {
    id,
    name,
    email,
    emailVerified,
    image,
    displayName,
    role,
    createdAt,
    updatedAt,
    ...user,
  };
});
