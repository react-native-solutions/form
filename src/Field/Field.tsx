// import * as React from 'react';
import { ReactElement, useContext } from 'react';
import FormContext from '../formContext';
import { fromValue, StateExtractor } from '../stateExtracrors';
import { validate } from '../validate';
import { pipe } from '../utils';

export interface FieldState<T> {
  readonly value: T;
  readonly valid?: boolean;
}

interface FieldProps {
  render: (props: any) => ReactElement;
  name: string;
}

const Field = ({ render, name }: FieldProps) => {
  const { state } = useContext(FormContext);
  const fieldConfig = state?.config.fields[name];

  const validationMiddleware = ({ value }: FieldState<any>) => ({
    value,
    valid: validate(value, fieldConfig?.validate),
  });

  const handleChange = (extractorOrEvent: StateExtractor<any> | any) => {
    if (typeof extractorOrEvent !== 'function') {
      return state?.changeField(
        name,
        pipe(fromValue, validationMiddleware)(extractorOrEvent)
      );
    }

    return (event: any) => {
      state?.changeField(
        name,
        pipe(extractorOrEvent, validationMiddleware)(event)
      );
    };
  };

  return render({
    ...state?.state.fields[name],
    handleChange,
  });
};

export default Field;
