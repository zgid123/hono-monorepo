import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@react/shadcn-ui/components/field';
import { cn } from '@react/shadcn-ui/lib/utils';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { JSX, ReactNode } from 'react';

export interface IFormWrapperProps {
  htmlFor?: string;
  label?: ReactNode;
  className?: string;
  children?: ReactNode;
  helperText?: ReactNode;
  state: AnyFieldApi['state'];
  m?: Record<string, unknown>;
}

export function FormWrapper({
  m,
  label,
  state,
  htmlFor,
  children,
  className,
  helperText,
}: IFormWrapperProps): JSX.Element {
  const errors = [
    ...new Set(
      state.meta.errors.flatMap((error) => {
        const message = typeof error === 'string' ? error : error?.message;

        return message ? [message] : [];
      }),
    ),
  ];
  const isInvalid = state.meta.isTouched && errors.length > 0;

  return (
    <Field className={className} data-invalid={isInvalid}>
      {label && (
        <FieldLabel
          className={cn('leading-none text-foreground-primary')}
          htmlFor={htmlFor}
        >
          {label}
        </FieldLabel>
      )}
      {children}
      {isInvalid ? (
        <FieldError
          className={cn('flex flex-col gap-1', 'font-semibold text-red')}
        >
          {errors.map((message) => {
            const translate =
              m && Object.hasOwn(m, message) ? m[message] : undefined;
            const translated =
              typeof translate === 'function' ? translate() : undefined;

            return (
              <span key={message}>
                {typeof translated === 'string' ? translated : message}
              </span>
            );
          })}
        </FieldError>
      ) : helperText ? (
        <FieldDescription>{helperText}</FieldDescription>
      ) : null}
    </Field>
  );
}
