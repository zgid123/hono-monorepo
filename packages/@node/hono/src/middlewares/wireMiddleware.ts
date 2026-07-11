import type { Env } from 'hono';
import { createMiddleware } from 'hono/factory';

interface ICreateWireMiddlewareParams<TWire> {
  wire: TWire;
}

export function createWireMiddleware<TWire extends Record<string, unknown>>({
  wire,
}: ICreateWireMiddlewareParams<TWire>): ReturnType<
  typeof createMiddleware<Env>
> {
  return createMiddleware<Env>((c, next) => {
    Object.entries(wire).forEach(([key, value]) => {
      c.set(key as never, value as never);
    });

    return next();
  });
}
