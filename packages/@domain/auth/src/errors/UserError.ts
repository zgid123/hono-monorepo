import { ApplicationError } from '@domain/core';
import interpole from 'string-interpolation-js';

import {
  CANNOT_BAN_CURRENT_USER_CODE,
  CANNOT_BAN_CURRENT_USER_MESSAGE,
  CANNOT_BAN_CURRENT_USER_NAME,
  INVALID_USER_PROVISIONING_INPUT_CODE,
  INVALID_USER_PROVISIONING_INPUT_MESSAGE,
  INVALID_USER_PROVISIONING_INPUT_NAME,
  USER_ALREADY_EXISTS_CODE,
  USER_ALREADY_EXISTS_MESSAGE,
  USER_ALREADY_EXISTS_NAME,
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_MESSAGE,
  USER_NOT_FOUND_NAME,
} from '../constants/userErrors';

export interface IUserAlreadyExistsErrorParams {
  readonly email: string;
}

export class UserError extends ApplicationError {
  public static invalidProvisioningInput(): UserError {
    return new UserError({
      httpCode: 400,
      name: INVALID_USER_PROVISIONING_INPUT_NAME,
      code: INVALID_USER_PROVISIONING_INPUT_CODE,
      message: INVALID_USER_PROVISIONING_INPUT_MESSAGE,
    });
  }

  public static notFound(): UserError {
    return new UserError({
      httpCode: 404,
      name: USER_NOT_FOUND_NAME,
      code: USER_NOT_FOUND_CODE,
      message: USER_NOT_FOUND_MESSAGE,
    });
  }

  public static alreadyExists({
    email,
  }: IUserAlreadyExistsErrorParams): UserError {
    return new UserError({
      httpCode: 409,
      name: USER_ALREADY_EXISTS_NAME,
      code: USER_ALREADY_EXISTS_CODE,
      message: interpole(USER_ALREADY_EXISTS_MESSAGE, {
        email,
      }),
    });
  }

  public static cannotBanCurrentUser(): UserError {
    return new UserError({
      httpCode: 409,
      name: CANNOT_BAN_CURRENT_USER_NAME,
      code: CANNOT_BAN_CURRENT_USER_CODE,
      message: CANNOT_BAN_CURRENT_USER_MESSAGE,
    });
  }
}
