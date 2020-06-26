import { FieldState } from '../createField';
import { FormConfig } from '../config';
import { FieldsState, FormState } from '../useForm';
import { createValidationMiddleware } from './field';

export const allValid = (fields: FieldsState): boolean => {
  return Object.values(fields).reduce<boolean>(
    (union: boolean, state: FieldState<any>) => {
      return union && state.validation?.valid !== false;
    },
    true
  );
};

export const validateForm = (
  state: FormState,
  config: FormConfig
): FormState => {
  const fields: FieldsState = Object.keys(state.fields).reduce<FieldsState>(
    (validated, current) => {
      const validator = config.fields?.[current]?.validate;

      if (!validator) {
        return {
          ...validated,
          [current]: fields[current],
        };
      }

      return {
        ...validated,
        [current]: createValidationMiddleware(
          validator,
          'always'
        )(state.fields[current]),
      };
    },
    {} as FieldsState
  );

  return {
    ...state,
    valid: allValid(fields),
    fields,
  };
};
