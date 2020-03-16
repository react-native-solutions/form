import * as React from 'react';
import { FormStateActions } from './useFormState';
import { FormMutableState } from './useFormState';

interface FormContext {
  state?: FormMutableState;
  actions?: FormStateActions;
}

export default React.createContext<FormContext>({});
