import { Button, FormInput, toast } from '@react/design-system/components';
import { cn } from '@react/design-system/utils';
import { useNavigate, useRouter } from '@tanstack/react-router';
import type { JSX } from 'react';

import { authClient } from '#/integrations/betterAuth/authClient';
import { useLocale } from '#/integrations/i18n/LocaleProvider';
import { m } from '#/integrations/i18n/paraglide/messages';

import { signUpFormOptions, useAppForm } from './hooks';

interface ISignUpFormProps {
  onSubmittingChange: (isSubmitting: boolean) => void;
}

export function SignUpForm({
  onSubmittingChange,
}: ISignUpFormProps): JSX.Element {
  useLocale();

  const navigate = useNavigate();
  const router = useRouter();
  const form = useAppForm({
    ...signUpFormOptions,
    onSubmit: async ({ value }) => {
      const result = await authClient.signUp.email(value);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      await router.invalidate();
      await navigate({
        to: '/',
        replace: true,
      });
    },
  });

  return (
    <div className={cn('flex flex-col gap-6')}>
      <h1>{m['auth.signUpForm.title']()}</h1>
      <p className={cn('text-sm')}>{m['auth.signUpForm.description']()}</p>
      <form.AppForm>
        <form
          className={cn('flex flex-col gap-4')}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSubmittingChange(true);

            void form.handleSubmit().finally(() => onSubmittingChange(false));
          }}
        >
          <form.AppField name='name'>
            {(field) => {
              return (
                <FormInput
                  autoComplete='name'
                  label={m['auth.model.name']()}
                  m={m}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  state={field.state}
                  type='text'
                />
              );
            }}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => {
              return (
                <FormInput
                  autoComplete='email'
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
                  autoComplete='new-password'
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
                  className={cn('w-full')}
                  isLoading={isSubmitting}
                  loaderText={m['auth.signUpForm.signingUp']()}
                  type='submit'
                >
                  {m['auth.signUpForm.submit']()}
                </Button>
              );
            }}
          </form.Subscribe>
        </form>
      </form.AppForm>
    </div>
  );
}
