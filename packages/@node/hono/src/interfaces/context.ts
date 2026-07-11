import type { Env } from 'hono';

export interface ICoreContextVariables<
  TVariables extends Record<string, unknown>,
> extends Env {
  // biome-ignore lint/style/useNamingConvention: hono typing
  Variables: TVariables;
}
