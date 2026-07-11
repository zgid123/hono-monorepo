import { createMiddleware } from 'hono/factory';

import type { ICoreContextVariables } from '../interfaces/context';

interface ICreateDrizzleMiddlewareParams<TDrizzle> {
  drizzle: TDrizzle;
}

export function createDrizzleMiddleware<TDrizzle>({
  drizzle,
}: ICreateDrizzleMiddlewareParams<TDrizzle>): ReturnType<
  typeof createMiddleware<ICoreContextVariables<{ drizzle: TDrizzle }>>
> {
  return createMiddleware<ICoreContextVariables<{ drizzle: TDrizzle }>>(
    (c, next) => {
      c.set('drizzle', drizzle);

      return next();
    },
  );
}
