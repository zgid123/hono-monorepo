import { Label } from '@react/shadcn-ui/components/label';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { JSX, ReactNode } from 'react';

export interface IFormWrapperProps {
  htmlFor?: string;
  label?: ReactNode;
  className?: string;
  children?: ReactNode;
  helperText?: ReactNode;
  state: AnyFieldApi['state'];
}

export function FormWrapper({
  label,
  state,
  htmlFor,
  children,
  className,
  helperText,
}: IFormWrapperProps): JSX.Element {
  const isInvalid = state.meta.isTouched && state.meta.errors.length > 0;

  return (
    <div className={className}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {isInvalid ? (
        <p className='flex flex-col gap-1'>
          {state.meta.errors.map((err) => {
            return <span key={err}>{err}</span>;
          })}
        </p>
      ) : helperText ? (
        <span>{helperText}</span>
      ) : null}
    </div>
  );
}
