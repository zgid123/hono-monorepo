import { ApplicationError } from '@domain/core';

import {
  INSUFFICIENT_PERMISSIONS_CODE,
  INSUFFICIENT_PERMISSIONS_MESSAGE,
  INSUFFICIENT_PERMISSIONS_NAME,
  UNAUTHORIZED_CODE,
  UNAUTHORIZED_MESSAGE,
  UNAUTHORIZED_NAME,
} from '../constants/authErrors';

export class AuthError extends ApplicationError {
  public static unauthorized(): AuthError {
    return new AuthError({
      httpCode: 401,
      name: UNAUTHORIZED_NAME,
      code: UNAUTHORIZED_CODE,
      message: UNAUTHORIZED_MESSAGE,
    });
  }

  public static insufficientPermissions(): AuthError {
    return new AuthError({
      httpCode: 403,
      name: INSUFFICIENT_PERMISSIONS_NAME,
      code: INSUFFICIENT_PERMISSIONS_CODE,
      message: INSUFFICIENT_PERMISSIONS_MESSAGE,
    });
  }
}
