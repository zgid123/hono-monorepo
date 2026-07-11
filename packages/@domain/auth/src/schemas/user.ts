import { BaseUuid } from '@domain/core';
import { type } from 'arktype';

export const Role = type("'user' | 'admin'");

export type TRole = typeof Role.infer;

export const User = BaseUuid.and({
  name: 'string',
  email: 'string.email',
  displayName: 'string | null',
  role: Role,
});

export type TUser = typeof User.infer;
