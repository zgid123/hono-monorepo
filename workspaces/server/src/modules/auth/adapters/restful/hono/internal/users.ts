import { Hono } from 'hono';

import { ListUsersQuery } from '../../../../application/queries';
import type { IAuthContextVariables } from '../../context';

export const usersEndpoint = new Hono<IAuthContextVariables>().get(
  '/',
  async (c) => {
    const { var: v } = c;

    const results = await v.cqrsx.exec(new ListUsersQuery());

    return c.json(
      {
        data: results,
      },
      200,
    );
  },
);
