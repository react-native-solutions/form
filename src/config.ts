import { Validator } from './validation/field';

export interface ValidationConfig<T> {
  every?: Validator<T>[];
  any?: Validator<T>[];
  only?: Validator<T>;
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
