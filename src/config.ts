import { ValidatorFunc } from './validation/field';

export interface FieldConfig<T> {
  initialValue: T;
  validate?: ValidatorFunc<T>;
}

export interface FieldsConfig {
  [name: string]: FieldConfig<any>;
}

export type ValidateOnChangeConfig = 'always' | 'invalid' | 'none';

export interface FormConfig {
  validateOnChange: ValidateOnChangeConfig;
  validateOnInit?: boolean;
  fields: FieldsConfig;
}
