import { FieldState } from './createField';

export type StateExtractor<T> = (event: any) => FieldState<T>;

export const fromValue = (value: any) => ({ value });

export const fromValueObject = ({ value }: { value: any }) => ({ value });
