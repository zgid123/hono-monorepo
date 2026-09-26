import { type } from 'arktype';

const Credentials = type({
  email: 'string.email',
  password: 'string',
});

export const SignIn = Credentials.onUndeclaredKey('reject');

export type TSignIn = typeof SignIn.infer;

export const SignUp = Credentials.and({
  name: 'string',
  'displayName?': 'string',
}).onUndeclaredKey('reject');

export type TSignUp = typeof SignUp.infer;
