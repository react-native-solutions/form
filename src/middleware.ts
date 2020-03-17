import { FieldState } from './createField';

export type FormMiddleware = (state: FieldState<any>) => FieldState<any>;
