import { type } from 'arktype';

export const Role = type("'user' | 'admin'");
export const UserStatus = type("'active' | 'banned'");
export const USER_PASSWORD_MAX_LENGTH = 128;

export type TRole = typeof Role.infer;
export type TUserStatus = typeof UserStatus.infer;

export const InternalUserParams = type({
  userId: 'string.uuid',
}).onUndeclaredKey('reject');

export type TInternalUserParams = typeof InternalUserParams.infer;

export const CreateInternalUser = type({
  name: 'string',
  email: 'string.email',
  password: `string >= 1 & string <= ${USER_PASSWORD_MAX_LENGTH}`,
  'image?': 'string',
  'displayName?': 'string',
}).onUndeclaredKey('reject');

export type TCreateInternalUser = typeof CreateInternalUser.infer;

export const UpdateInternalUserProfile = type({
  'name?': 'string',
  'image?': 'string | null',
  'displayName?': 'string | null',
}).onUndeclaredKey('reject');

export type TUpdateInternalUserProfile = typeof UpdateInternalUserProfile.infer;

export const ChangeInternalUserRole = type({
  role: Role,
}).onUndeclaredKey('reject');

export type TChangeInternalUserRole = typeof ChangeInternalUserRole.infer;

export const ChangeInternalUserStatus = type({
  status: UserStatus,
}).onUndeclaredKey('reject');

export type TChangeInternalUserStatus = typeof ChangeInternalUserStatus.infer;
