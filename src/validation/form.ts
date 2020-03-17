import { FieldState } from '../createField';
import { FormConfig } from '../config';
import { FieldsState, FormState } from '../useForm';
import { validationMiddleware } from './field';

export const allValid = (fields: FieldsState): boolean => {
  return Object.values(fields).reduce<boolean>(
    (union: boolean, state: FieldState<any>) => {
      return union && !!state.validation?.valid;
    },
    true
  );
};

export const validateForm = (
  state: FormState,
  config: FormConfig
): FormState => {
  const fields = Object.keys(state.fields).reduce(
    (validated, current) => ({
      ...validated,
      [current]: validationMiddleware(config.fields[current].validate)(
        state.fields[current]
      ),
    }),
    {}
  );

  return {
    ...state,
    valid: allValid(fields),
    fields,
  };
};
