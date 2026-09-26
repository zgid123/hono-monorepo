import {
  type ICreateUserParams,
  type IUserProvisioner,
  UserError,
} from '@domain/auth';
import { isAPIError } from 'better-auth/api';

import type { TBetterAuth } from '../instance';

export interface IUserProvisionerParams {
  readonly auth: TBetterAuth;
}

export class UserProvisioner implements IUserProvisioner {
  readonly #auth: TBetterAuth;

  public constructor({ auth }: IUserProvisionerParams) {
    this.#auth = auth;
  }

  public async create({
    name,
    email,
    image,
    password,
    displayName,
  }: ICreateUserParams): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      await this.#auth.api.createUser({
        body: {
          name,
          password,
          email: normalizedEmail,
          data: {
            ...(image === undefined
              ? {}
              : {
                  image,
                }),
            ...(displayName === undefined
              ? {}
              : {
                  displayName,
                }),
          },
        },
      });
    } catch (error) {
      if (
        isAPIError(error) &&
        error.body?.code ===
          this.#auth.$ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL.code
      ) {
        throw UserError.alreadyExists({
          email: normalizedEmail,
        });
      }

      if (isAPIError(error) && error.status === 'BAD_REQUEST') {
        throw UserError.invalidProvisioningInput();
      }

      throw error;
    }
  }
}
