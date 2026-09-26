import { arkValidator } from '@alphacifer/hono/arktype-validator';
import { HonoCommonError } from '@alphacifer/hono/core';
import {
  ChangeInternalUserRole,
  ChangeInternalUserStatus,
  CreateInternalUser,
  InternalUserParams,
  InternalUserViewModel,
  UpdateInternalUserProfile,
} from '@contracts/auth';
import { resolvePagy } from '@core/utils';
import { serialize } from '@eidora/hono-arktype-middleware';
import { Hono } from 'hono';

import {
  ChangeUserRoleCommand,
  ChangeUserStatusCommand,
  CreateUserCommand,
  UpdateUserProfileCommand,
} from '../../../../application/commands';
import { GetUserQuery, ListUsersQuery } from '../../../../application/queries';
import type { IAuthenticatedContextVariables } from '../../context';

export const usersEndpoint = new Hono<IAuthenticatedContextVariables>()
  .get('/', serialize(InternalUserViewModel), async (c) => {
    const pagy = resolvePagy({
      page: Number(c.req.query('page')),
      limit: Number(c.req.query('limit')),
    });

    const result = await c.var.cqrsx.exec(
      new ListUsersQuery({
        page: pagy.page,
        limit: pagy.limit,
      }),
    );

    return c.json(
      {
        data: result.data,
        metadata: {
          ...result.metadata,
          totalPages: Math.ceil(result.metadata.total / result.metadata.limit),
        },
      },
      200,
    );
  })
  .post('/', arkValidator('json', CreateInternalUser), async (c) => {
    const body = c.req.valid('json');

    await c.var.cqrsx.exec(
      new CreateUserCommand({
        name: body.name,
        email: body.email,
        image: body.image,
        password: body.password,
        displayName: body.displayName,
      }),
    );

    return c.body(null, 201);
  })
  .get(
    '/:userId',
    arkValidator('param', InternalUserParams),
    serialize(InternalUserViewModel),
    async (c) => {
      const { userId } = c.req.valid('param');
      const user = await c.var.cqrsx.exec(
        new GetUserQuery({
          userId,
        }),
      );

      return c.json(
        {
          data: user,
        },
        200,
      );
    },
  )
  .patch(
    '/:userId',
    arkValidator('param', InternalUserParams),
    arkValidator('json', UpdateInternalUserProfile),
    async (c) => {
      const body = c.req.valid('json');
      const { userId } = c.req.valid('param');

      if (Object.keys(body).length === 0) {
        throw HonoCommonError.invalidParams({
          detail: 'At least one profile field is required',
        });
      }

      await c.var.cqrsx.exec(
        new UpdateUserProfileCommand({
          userId,
          name: body.name,
          image: body.image,
          displayName: body.displayName,
        }),
      );

      return c.body(null, 204);
    },
  )
  .patch(
    '/:userId/role',
    arkValidator('param', InternalUserParams),
    arkValidator('json', ChangeInternalUserRole),
    async (c) => {
      const { role } = c.req.valid('json');
      const { userId } = c.req.valid('param');

      await c.var.cqrsx.exec(
        new ChangeUserRoleCommand({
          role,
          userId,
        }),
      );

      return c.body(null, 204);
    },
  )
  .patch(
    '/:userId/status',
    arkValidator('param', InternalUserParams),
    arkValidator('json', ChangeInternalUserStatus),
    async (c) => {
      const { status } = c.req.valid('json');
      const { userId } = c.req.valid('param');

      await c.var.cqrsx.exec(
        new ChangeUserStatusCommand({
          status,
          userId,
          currentUserId: c.var.currentUser.id,
        }),
      );

      return c.body(null, 204);
    },
  );
