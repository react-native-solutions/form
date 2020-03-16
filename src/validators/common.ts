import { FieldState } from '../Field';

interface WithLength {
  length: number;
  [key: string]: any;
}

const maxLength = (length: number) => ({
  value,
}: FieldState<string | Array<any> | WithLength>) => value.length <= length;

const minLength = (length: number) => ({
  value,
}: FieldState<string | Array<any> | WithLength>) => value.length >= length;

export default {
  maxLength,
  minLength,
};
