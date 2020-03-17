import { Reducer, useReducer, useCallback, useMemo, ReactElement } from 'react';
import { FieldsConfig, FormConfig } from './config';
import { createField, FieldProps, FieldState } from './createField';
import { toUpperCamelCase } from './camelCase';
import { validateForm, allValid } from './validation/form';

export interface FieldsState {
  [name: string]: FieldState<any>;
}

export interface FormState {
  fields: FieldsState;
  valid: boolean;
}

enum FormActionTypes {
  CHANGE_FIELD = 'CHANGE_FIELD',
  RESET = 'RESET',
  VALIDATE = 'VALIDATE',
}

interface FormAction {
  type: FormActionTypes;
  payload: any;
  meta?: any;
}

export interface FormMutableState {
  state: FormState;
  config: FormConfig;
  changeField: (fieldName: string, state: FieldState<any>) => void;
  reset: () => void;
  validate: () => void;
}

export interface Form extends FormMutableState {
  Fields: {
    [FieldName: string]: (props: FieldProps) => ReactElement;
  };
}

const initFormState = (config: FieldsConfig): FormState => ({
  fields: Object.keys(config).reduce<FieldsState>(
    (state: FieldsState, fieldName: string) => ({
      ...state,
      [fieldName]: {
        value: config[fieldName].initialValue,
        validation: { valid: true },
      },
    }),
    {} as FieldsState
  ),
  valid: true,
});

const formReducer = (state: FormState, action: FormAction): FormState => {
  const { type, payload, meta } = action;

  switch (type) {
    case FormActionTypes.CHANGE_FIELD:
      return {
        ...state,
        valid: allValid(state.fields),
        fields: {
          ...state.fields,
          [meta.fieldName]: {
            ...state.fields[meta.fieldName],
            ...payload,
          },
        },
      };
    case FormActionTypes.RESET:
      return initFormState(payload);
    case FormActionTypes.VALIDATE:
      return validateForm(state, payload);
  }
};

const useForm = (config: FormConfig): Form => {
  const [formState, dispatch] = useReducer<Reducer<FormState, FormAction>>(
    formReducer,
    initFormState(config.fields)
  );

  const changeField = useCallback(
    (fieldName: string, state: FieldState<any>) => {
      dispatch({
        type: FormActionTypes.CHANGE_FIELD,
        payload: state,
        meta: { fieldName },
      });
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: FormActionTypes.RESET, payload: config.fields });
  }, []);

  const validate = useCallback(() => {
    dispatch({ type: FormActionTypes.VALIDATE, payload: config.fields });
  }, []);

  const Fields = useMemo(
    () =>
      Object.keys(config.fields).reduce(
        (fields, fieldName: string) => ({
          ...fields,
          [`${toUpperCamelCase(fieldName)}Field`]: createField(
            fieldName,
            config.validateOnChange
          ),
        }),
        {}
      ),
    []
  );

  return {
    Fields,
    state: formState,
    config,
    changeField,
    reset,
    validate,
  };
};

export default useForm;
