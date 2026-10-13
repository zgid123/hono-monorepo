import { type } from 'arktype';

export const RoleSchema = type("'user' | 'admin'");
export const UserStatusSchema = type("'active' | 'banned'");
export const USER_PASSWORD_MAX_LENGTH = 128;

export type TRole = typeof RoleSchema.infer;
export type TUserStatus = typeof UserStatusSchema.infer;

export const InternalUserParamsSchema = type({
  userId: 'string.uuid',
}).onUndeclaredKey('reject');

export type TInternalUserParams = typeof InternalUserParamsSchema.infer;

export const CreateInternalUserSchema = type({
  name: 'string',
  email: type('string.email').configure({
    message: () => 'auth.issues.email',
  }),
  password: `string >= 1 & string <= ${USER_PASSWORD_MAX_LENGTH}`,
  'image?': 'string',
  'displayName?': 'string',
}).onUndeclaredKey('reject');

export type TCreateInternalUser = typeof CreateInternalUserSchema.infer;

export const UpdateInternalUserProfileSchema = type({
  'name?': 'string',
  'image?': 'string | null',
  'displayName?': 'string | null',
}).onUndeclaredKey('reject');

export type TUpdateInternalUserProfile =
  typeof UpdateInternalUserProfileSchema.infer;

export const ChangeInternalUserRoleSchema = type({
  role: RoleSchema,
}).onUndeclaredKey('reject');

export type TChangeInternalUserRole = typeof ChangeInternalUserRoleSchema.infer;

export const ChangeInternalUserStatusSchema = type({
  status: UserStatusSchema,
}).onUndeclaredKey('reject');

export type TChangeInternalUserStatus =
  typeof ChangeInternalUserStatusSchema.infer;
