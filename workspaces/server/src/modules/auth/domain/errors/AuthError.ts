import { HonoError } from '@alphacifer/hono/core';
import { UNAUTHORIZED_CODE, UNAUTHORIZED_NAME } from '@domain/auth';

export class AuthError extends HonoError {
  public static unauthorized(): AuthError {
    return new AuthError({
      status: 401,
      code: UNAUTHORIZED_CODE,
      name: UNAUTHORIZED_NAME,
      message: 'Unauthorized',
    });
  }
}
