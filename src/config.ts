import {
  ErrorMessageCreator,
  Validator,
  ValidatorFunc,
} from './validation/field';

export type EveryValidationConfig<T> = Validator<T>[];

export type AnyValidationConfig<T> = [
  string | ErrorMessageCreator<T>,
  ValidatorFunc<T>[]
];
export type OnlyValidationConfig<T> = Validator<T>;

export interface ValidationConfig<T> {
  every?: EveryValidationConfig<T>;
  any?: AnyValidationConfig<T>;
  only?: OnlyValidationConfig<T>;
}

export interface FieldConfig<T> {
  initialValue: T;
  validate?: ValidationConfig<T>;
}

export interface FieldsConfig {
  [name: string]: FieldConfig<any>;
}

export interface FormConfig {
  validateOnChange: boolean;
  fields: FieldsConfig;
}
