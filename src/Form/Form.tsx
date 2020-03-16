import * as React from 'react';
import FormContext from '../formContext';
import { ReactNode } from 'react';
import { FormMutableState } from '../useFormState';

interface FormProps {
  children: ReactNode;
  onSubmit: any;
  state: FormMutableState;
}

const Form = ({ children, onSubmit, state: formState }: FormProps) => {
  const handleSubmit = () => {
    onSubmit(formState);
  };

  const context = {
    state: formState,
    actions: {
      submit: handleSubmit,
    },
  };

  return (
    <FormContext.Provider value={context}>{children}</FormContext.Provider>
  );
};

export default Form;
