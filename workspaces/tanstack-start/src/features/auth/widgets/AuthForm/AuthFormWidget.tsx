import { Button, Panel } from '@react/design-system/components';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { type JSX, useState } from 'react';

import { SignInForm, SignUpForm } from '#/features/auth/components';
import { m } from '#/integrations/i18n/paraglide/messages';

export function AuthFormWidget(): JSX.Element {
  const { mode } = useSearch({
    from: '/auth',
  });

  const navigate = useNavigate({
    from: '/auth',
  });

  const isSignUp = mode === 'signUp';
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Panel className='w-full max-w-md'>
      {isSignUp ? (
        <SignUpForm onSubmittingChange={setIsSubmitting} />
      ) : (
        <SignInForm onSubmittingChange={setIsSubmitting} />
      )}
      <div className='text-center'>
        <Button
          disabled={isSubmitting}
          onClick={() => {
            navigate({
              replace: true,
              search: {
                mode: isSignUp ? undefined : 'signUp',
              },
            });
          }}
          type='button'
          variant='ghost'
        >
          {isSignUp
            ? m['auth.alreadyHaveAccount']()
            : m['auth.dontHaveAccount']()}
        </Button>
      </div>
    </Panel>
  );
}
