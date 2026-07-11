import { type } from 'arktype';

export const SignIn = type({
  email: 'string.email',
  password: 'string',
});

export type TSignIn = typeof SignIn.infer;

export const SignUp = SignIn.and({
  name: 'string?',
  displayName: 'string?',
});

export type TSignUp = typeof SignUp.infer;
