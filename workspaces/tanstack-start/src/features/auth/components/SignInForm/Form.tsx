import { Button, FormInput } from '@react/design-system/components';
import { useNavigate } from '@tanstack/react-router';
import type { JSX } from 'react';

import { authClient } from '#/integrations/betterAuth/authClient';
import { m } from '#/integrations/i18n/paraglide/messages';

import { signInFormOptions, useAppForm } from './hooks';

interface ISignInFormProps {
  onSubmittingChange: (isSubmitting: boolean) => void;
}

export function SignInForm({
  onSubmittingChange,
}: ISignInFormProps): JSX.Element {
  const navigate = useNavigate();
  const form = useAppForm({
    ...signInFormOptions,
    onSubmit: async ({ value }) => {
      const result = await authClient.signIn.email(value);

      if (result.error) {
        return;
      }

      await navigate({
        to: '/',
        replace: true,
      });
    },
  });

  return (
    <div className='flex flex-col gap-6'>
      <h1>{m['auth.signInForm.title']()}</h1>
      <p className='text-sm'>{m['auth.signInForm.description']()}</p>
      <form.AppForm>
        <form
          className='flex flex-col gap-4'
          method='post'
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSubmittingChange(true);

            form.handleSubmit().finally(() => onSubmittingChange(false));
          }}
        >
          <form.AppField name='email'>
            {(field) => {
              return (
                <FormInput
                  label={m['auth.model.email']()}
                  m={m}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  state={field.state}
                  type='email'
                />
              );
            }}
          </form.AppField>
          <form.AppField name='password'>
            {(field) => {
              return (
                <FormInput
                  label={m['auth.model.password']()}
                  m={m}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  state={field.state}
                  type='password'
                />
              );
            }}
          </form.AppField>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => {
              return (
                <Button
                  className='w-full'
                  isLoading={isSubmitting}
                  loaderText={m['auth.signInForm.signingIn']()}
                  type='submit'
                >
                  {m['auth.signInForm.submit']()}
                </Button>
              );
            }}
          </form.Subscribe>
        </form>
      </form.AppForm>
    </div>
  );
}
