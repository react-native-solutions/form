import React, {
  memo,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import FormContext from '../formContext';
import { fromValue, StateExtractor } from '../stateExtracrors';
import {
  FieldValidationState,
  createValidationMiddleware,
} from '../validation/field';
import { pipe } from '../utils';
import { FormMiddleware } from '../middleware';

export interface FieldState<T> {
  readonly value: T;
  validation?: FieldValidationState;
}

export interface InputProps<T> extends FieldState<T> {
  handleChange: (extractorOrEvent: StateExtractor<T> | any) => void;
}

export type FieldProps = {
  render: (
    props: any
  ) => ReactElement | ReactElement<(props: any) => ReactElement>;
} & {
  [propsToPassKey: string]: any;
};

export const createField = (name: string, validateOnChange: boolean) => {
  const Field = ({ render, ...props }: FieldProps) => {
    const { form } = useContext(FormContext);
    const fieldConfig = form?.config.fields[name];

    const handleChange = useCallback(
      (extractorOrEvent: StateExtractor<any> | any) => {
        const middleware: FormMiddleware[] = [];

        if (validateOnChange) {
          middleware.push(createValidationMiddleware(fieldConfig?.validate));
        }

        if (typeof extractorOrEvent !== 'function') {
          return form?.changeField(
            name,
            pipe(fromValue, ...middleware)(extractorOrEvent)
          );
        }

        return (event: any) => {
          form?.changeField(name, pipe(extractorOrEvent, ...middleware)(event));
        };
      },
      []
    );

    const Memoized = useMemo(() => memo(render), [form?.state.valid]);

    return (
      <Memoized
        {...props}
        {...{
          ...form?.state.fields[name],
          handleChange,
        }}
      />
    );
  };

  return memo(Field);
};
