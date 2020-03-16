import { Reducer, useReducer, useCallback } from 'react';
import { FieldsConfig, FormConfig } from './config';
import { FieldState } from './Field';

interface FieldsState {
  [name: string]: FieldState<any>;
}

export interface FormState {
  fields: FieldsState;
  valid: boolean;
}

export interface FormStateActions {
  submit: () => void;
}

enum FormActionTypes {
  CHANGE_FIELD = 'CHANGE_FIELD',
  RESET = 'RESET',
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
}

const initFormState = (config: FieldsConfig): FormState => ({
  fields: Object.keys(config).reduce<FieldsState>(
    (state: FieldsState, fieldName: string) => ({
      ...state,
      [fieldName]: { value: config[fieldName].initialValue },
    }),
    {} as FieldsState
  ),
  valid: true,
});

const allValid = (fields: FieldsState): boolean => {
  return Object.values(fields).reduce<boolean>(
    (union: boolean, state: FieldState<any>) => {
      return union && !!state.valid;
    },
    true
  );
};

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
  }
};

const useFormState = (config: FormConfig): FormMutableState => {
  const [formState, dispatch] = useReducer<Reducer<FormState, FormAction>>(
    formReducer,
    initFormState(config.fields)
  );

  const changeField = useCallback(
    (fieldName: string, state: FieldState<any>) => {
      console.log(state, formState);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state: formState,
    config,
    changeField,
    reset,
  };
};

export default useFormState;
