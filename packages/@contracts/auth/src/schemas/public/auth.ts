import { type } from 'arktype';

const Credentials = type({
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

export const SignIn = Credentials.onUndeclaredKey('reject');

export type TSignIn = typeof SignIn.infer;

export const SignUp = Credentials.and({
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

export type TSignUp = typeof SignUp.infer;
