import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AnyFieldApi } from '@tanstack/react-form';
import { type JSX, useState } from 'react';

import { FormInput } from './FormInput';

const meta = {
  title: 'Design System/Form/FormInput',
  component: FormInput,
} satisfies Meta<typeof FormInput>;

export default meta;

interface ICreateFieldStateOptions {
  touched?: boolean;
  errors?: Array<{ message: string }>;
}

function createFieldState(
  value: string,
  options?: ICreateFieldStateOptions,
): AnyFieldApi['state'] {
  const errors = options?.errors ?? [];

  return {
    value,
    meta: {
      errors,
      isValid: errors.length === 0,
      isTouched: options?.touched ?? false,
    },
  } as AnyFieldApi['state'];
}

interface IFormInputDemoProps {
  label?: string;
  invalid?: boolean;
  helperText?: string;
  placeholder?: string;
}

function FormInputDemo({
  label,
  helperText,
  invalid = false,
  placeholder = 'Enter text...',
}: IFormInputDemoProps): JSX.Element {
  const [value, setValue] = useState('');

  return (
    <FormInput
      helperText={helperText}
      label={label}
      name='demo'
      onChange={setValue}
      placeholder={placeholder}
      state={createFieldState(value, {
        touched: invalid,
        errors: invalid
          ? [
              {
                message: 'This field is required',
              },
            ]
          : [],
      })}
    />
  );
}

type TStory = StoryObj<typeof FormInputDemo>;

export const Default: TStory = {
  render: () => {
    return <FormInputDemo placeholder='Email' />;
  },
};

export const WithLabel: TStory = {
  render: () => {
    return <FormInputDemo label='Email' placeholder='Email' />;
  },
};

export const WithHelperText: TStory = {
  render: () => {
    return (
      <FormInputDemo
        helperText='We will never share your email.'
        label='Email'
        placeholder='Email'
      />
    );
  },
};

export const Invalid: TStory = {
  render: () => {
    return <FormInputDemo invalid label='Email' placeholder='Email' />;
  },
};
