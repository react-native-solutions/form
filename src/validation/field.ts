import { FieldState } from '../createField';
import {
  AnyValidationConfig,
  OnlyValidationConfig,
  ValidateOnChangeConfig,
  ValidationConfig,
} from '../config';
import { identity } from '../utils';
import { FormMiddleware } from '../middleware';

export interface FieldValidationState {
  valid?: boolean;
  errors?: string[];
}

export type ValidatorFunc<T> = (state: FieldState<T>) => boolean;

export type ErrorMessageCreator<T> = (value: T) => string;

export type Validator<T> =
  | [string | ErrorMessageCreator<T>, ValidatorFunc<T>]
  | ValidatorFunc<T>;

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

  if (typeof validator === 'function') {
    return { valid: validator(state) };
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

const validateOnly = (
  onlyConfig: OnlyValidationConfig<any>,
  validationStrategy: ValidateOnChangeConfig
) => (state: FieldState<any>) => {
  const { valid, error } = validateField(onlyConfig, state);

  if (
    validationStrategy === 'invalid' &&
    state.validation?.valid !== false &&
    !valid
  ) {
    return { ...state };
  }

  return updateValidationState(state, valid, error);
};

const validateEvery = (
  everyConfig: Validator<any>[],
  validationStrategy: ValidateOnChangeConfig
) => {
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

    if (
      validationStrategy === 'invalid' &&
      state.validation?.valid !== false &&
      updated.validation?.valid === false
    ) {
      return { ...state };
    }

    return updated;
  };
};

const validateAny = (
  anyConfig: AnyValidationConfig<any>,
  validationStrategy: ValidateOnChangeConfig
) => {
  const [errorOrCreator, validators] = anyConfig;

  return (state: FieldState<any>) => {
    let updated = { ...state };

    for (let index = 0; index < validators.length; index++) {
      const { valid, error } = validateField(
        [errorOrCreator, validators[index]],
        updated
      );

      updated = updateValidationState(updated, valid, error);

      if (valid) {
        break;
      }
    }

    if (
      validationStrategy === 'invalid' &&
      state.validation?.valid !== false &&
      updated.validation?.valid === false
    ) {
      return { ...state };
    }

    return updated;
  };
};

export const createValidationMiddleware = (
  validationConfig: ValidationConfig<any> | undefined,
  validationStrategy: ValidateOnChangeConfig
): FormMiddleware => {
  if (validationConfig?.only) {
    return validateOnly(validationConfig.only, validationStrategy);
  }

  if (validationConfig?.every) {
    return validateEvery(validationConfig.every, validationStrategy);
  }

  if (validationConfig?.any) {
    return validateAny(validationConfig.any, validationStrategy);
  }

  return identity;
};

export const clearValidationErrors = (
  state: FieldState<any>
): FieldState<any> => ({
  ...state,
  validation: {
    ...state.validation,
    valid: state.validation?.valid,
    errors: [],
  },
});
