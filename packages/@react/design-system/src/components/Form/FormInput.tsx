import { cn } from '@react/shadcn-ui/lib/utils';
import type { ComponentProps, JSX } from 'react';

import { Input } from '../Input';
import { FormWrapper, type IFormWrapperProps } from './FormWrapper';

export interface IFormInputProps
  extends IFormWrapperProps,
    Omit<
      ComponentProps<typeof Input>,
      'name' | 'state' | 'onChange' | 'label'
    > {
  name: string;
  fieldClassName?: string;
  onChange: (value: string) => void;
}

export function FormInput({
  m,
  name,
  state,
  label,
  onBlur,
  onChange,
  className,
  helperText,
  fieldClassName,
  ...rest
}: IFormInputProps): JSX.Element {
  const isInvalid = state.meta.isTouched && state.meta.errors.length > 0;

  return (
    <FormWrapper
      className={cn('flex flex-col gap-2', fieldClassName)}
      helperText={helperText}
      htmlFor={name}
      label={label}
      m={m}
      state={state}
    >
      <Input
        aria-invalid={isInvalid}
        className={className}
        id={name}
        name={name}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        value={state.value ?? ''}
        {...rest}
      />
    </FormWrapper>
  );
}
