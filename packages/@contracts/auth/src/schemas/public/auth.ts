import { type } from 'arktype';

const CredentialsSchema = type({
  email: type('string.email').configure({
    message: () => 'auth.issues.email',
  }),
  password: type('string').configure({
    message: () => 'auth.issues.password',
  }),
}).configure(
  {
    message: (error) => `auth.issues.${error.propString}`,
  },
  'required',
);

export const SignInSchema = CredentialsSchema.onUndeclaredKey('reject');

export type TSignIn = typeof SignInSchema.infer;

export const SignUpSchema = CredentialsSchema.and({
  name: type('string').configure({
    message: () => 'auth.issues.name',
  }),
  'displayName?': 'string',
})
  .configure(
    {
      message: (error) => `auth.issues.${error.propString}`,
    },
    'required',
  )
  .onUndeclaredKey('reject');

export type TSignUp = typeof SignUpSchema.infer;
