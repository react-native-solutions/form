import { FieldState } from '../createField';
import { ValidateOnChangeConfig } from '../config';
import { FormMiddleware } from '../middleware';
import { identity } from '../utils';

export interface FieldValidationState {
  valid?: boolean;
  error?: string;
}

export type ValidatorFunc<T> = (
  state: FieldState<T>,
  done: () => FieldValidationState,
  error: (message: string) => FieldValidationState
) => FieldValidationState;

const done = (): FieldValidationState => ({
  valid: true,
});

const error = (message: string): FieldValidationState => ({
  valid: false,
  error: message,
});

export const createValidationMiddleware = (
  validator: ValidatorFunc<any>,
  validationStrategy: ValidateOnChangeConfig
): FormMiddleware => {
  if (validationStrategy === 'always') {
    return (state: FieldState<any>) => ({
      ...state,
      validation: validator(state, done, error),
    });
  }

  if (validationStrategy === 'invalid') {
    return (state: FieldState<any>) => {
      const shouldValidate = state.validation?.valid === false;

      if (!shouldValidate) {
        return state;
      }

      return {
        ...state,
        validation: validator(state, done, error),
      };
    };
  }

  return identity;
};
