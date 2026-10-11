import { SignUp, type TSignUp } from '@contracts/auth';
import {
  createFormHook,
  createFormHookContexts,
  formOptions,
  revalidateLogic,
} from '@tanstack/react-form';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const signUpFormOptions = formOptions({
  defaultValues: {} as TSignUp,
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: SignUp,
  },
});

export const { useAppForm } = createFormHook({
  formContext,
  fieldContext,
  formComponents: {},
  fieldComponents: {},
});
