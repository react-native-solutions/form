import { FieldState } from '../createField';
import { ValidationConfig } from '../config';
import { identity } from '../utils';
import { FormMiddleware } from '../middleware';

export interface FieldValidationState {
  valid: boolean;
  errors?: string[];
}

export type ValidatorFunc<T> = (state: FieldState<T>) => boolean;

export type ErrorMessageCreator<T> = (value: T) => string;

export type Validator<T> = [string | ErrorMessageCreator<T>, ValidatorFunc<T>];

export const updateValidationState = (
  state: FieldState<any>,
  valid: boolean,
  error: string | undefined
): FieldState<any> => {
  const updatedState = { ...state };
  if (!updatedState.validation) {
    updatedState.validation = { valid };
  } else {
    updatedState.validation.valid = valid;
  }

  if (valid) {
    updatedState.validation.errors?.shift();
    return updatedState;
  }

  if (!updatedState.validation.errors) {
    updatedState.validation.errors = [];
  }

  if (error) {
    updatedState.validation.errors.push(error);
  }

  return updatedState;
};

const validateField = (
  validator: Validator<any> | undefined,
  state: FieldState<any>
) => {
  if (!validator) {
    return { valid: true };
  }

  const [errorOrCreator, validatorFunc] = validator;

  const result = validatorFunc(state);
  let error = '';

  if (!result) {
    if (typeof errorOrCreator === 'function') {
      error = errorOrCreator(state.value);
    } else {
      error = errorOrCreator;
    }
  }

  return { error, valid: result };
};

const validateOnly = (onlyConfig: Validator<any>) => (
  state: FieldState<any>
) => {
  const { valid, error } = validateField(onlyConfig, state);

  return updateValidationState(state, valid, error);
};

const validateEvery = (everyConfig: Validator<any>[]) => {
  return (state: FieldState<any>) => {
    let updated = { ...state };
    for (const config of everyConfig) {
      const { valid, error } = validateField(config, updated);

      updated = updateValidationState(
        updated,
        valid && updated.validation?.valid !== false,
        error
      );
    }

    return updated;
  };
};

const validateAny = (anyConfig: Validator<any>[]) => {
  return (state: FieldState<any>) => {
    let updated = { ...state };
    for (let index = 0; index < anyConfig.length; index++) {
      const { valid, error } = validateField(anyConfig[index], updated);
      updated = updateValidationState(updated, valid, error);

      if (valid) {
        break;
      }
    }

    return updated;
  };
};

export const createValidationMiddleware = (
  validationConfig: ValidationConfig<any> | undefined
): FormMiddleware => {
  if (validationConfig?.only) {
    return validateOnly(validationConfig.only);
  }

  if (validationConfig?.every) {
    return validateEvery(validationConfig.every);
  }

  if (validationConfig?.any) {
    return validateAny(validationConfig.any);
  }

  return identity;
};
