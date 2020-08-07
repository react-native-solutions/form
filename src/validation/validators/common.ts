import { FieldState } from '../../createField';

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

const stringRequired = ({ value }: FieldState<string>) => value.length !== 0;

const checkboxRequired = ({ value }: FieldState<boolean>) => value;

const email = ({ value }: FieldState<string>) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(value);

export { maxLength, minLength, stringRequired, checkboxRequired, email };
