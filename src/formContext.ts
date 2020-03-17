import * as React from 'react';
import { FormStateActions } from './FormAction';
import { FormMutableState } from './useForm';

interface FormContext {
  form?: FormMutableState;
  actions?: FormStateActions;
}

export default React.createContext<FormContext>({});
