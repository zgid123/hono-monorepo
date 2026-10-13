import { SignInSchema, type TSignIn } from '@contracts/auth';
import {
  createFormHook,
  createFormHookContexts,
  formOptions,
  revalidateLogic,
} from '@tanstack/react-form';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const signInFormOptions = formOptions({
  defaultValues: {} as TSignIn,
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: SignInSchema,
  },
});

export const { useAppForm } = createFormHook({
  formContext,
  fieldContext,
  formComponents: {},
  fieldComponents: {},
});
