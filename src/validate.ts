import { FieldState } from './Field';
import { ValidationConfig } from './config';
import { union, disjunction } from './utils';

export type Validator<T> = (state: FieldState<T>) => boolean;

export const validate = (
  value: any,
  validationConfig: ValidationConfig<any> | undefined
): boolean => {
  if (!validationConfig) {
    return true;
  }

  if (validationConfig.only) {
    return validationConfig.only(value);
  }

  let anyResult = false;
  let everyResult = false;

  if (validationConfig.every) {
    anyResult = !!union<Validator<any>>(...validationConfig.every)(value);
  }
  if (validationConfig.any) {
    everyResult = !!disjunction<Validator<any>>(...validationConfig.any)(value);
  }

  if (validationConfig.every && validationConfig.any) {
    return anyResult && everyResult;
  }

  return true;
};
