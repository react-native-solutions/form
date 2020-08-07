import React, {
  memo,
  NamedExoticComponent,
  ReactElement,
  useCallback,
  useContext,
} from 'react';
import FormContext from '../formContext';
import { fromValue, StateExtractor } from '../stateExtracrors';
import {
  FieldValidationState,
  createValidationMiddleware,
} from '../validation/field';
import { pipe } from '../utils';
import { FormMiddleware } from '../middleware';
import { useMemoOne } from 'use-memo-one';
import { ValidateOnChangeConfig } from '../config';

export interface FieldState<T> {
  readonly value: T;
  validation?: FieldValidationState;
}

export interface InputProps<T> extends FieldState<T> {
  handleChange: (extractorOrEvent: StateExtractor<T> | any) => void;
  validate: () => void;
}

export type FieldProps = {
  render: (
    props: any
  ) =>
    | ReactElement
    | ReactElement<(props: any) => ReactElement>
    | NamedExoticComponent<any>;
} & {
  [propsToPassKey: string]: any;
};

export const createField = (
  name: string,
  validateOnChange: ValidateOnChangeConfig
) => {
  const Field = ({ render, ...props }: FieldProps) => {
    const { form } = useContext(FormContext);
    const fieldConfig = form?.config.fields[name];

    const handleChange = useCallback(
      (extractorOrEvent: StateExtractor<any> | any) => {
        const middleware: FormMiddleware[] = [];

        if (validateOnChange !== 'none' && fieldConfig?.validate) {
          middleware.push(
            createValidationMiddleware(
              fieldConfig?.validate,
              form?.config.validateOnChange || 'none'
            )
          );
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

    const validate = () => {
      if (!fieldConfig?.validate) {
        return;
      }

      form?.changeField(
        name,
        createValidationMiddleware(
          fieldConfig?.validate,
          'always'
        )(form?.state.fields[name])
      );
    };

    const Memoized = useMemoOne(() => memo(render as any), []);

    return (
      <Memoized
        {...props}
        {...{
          ...form?.state.fields[name],
          handleChange,
          validate,
        }}
      />
    );
  };

  return memo(Field);
};
