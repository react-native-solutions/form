import * as React from 'react';
import FormContext from '../formContext';
import { ReactNode } from 'react';
import { FormMutableState, FormState } from '../useForm';
import { validateForm } from '../validation/form';

interface FormProviderProps {
  children: ReactNode;
  onSubmit: (state: FormState) => any;
  form: FormMutableState;
}

const FormProvider = ({ children, onSubmit, form }: FormProviderProps) => {
  const handleSubmit = () => {
    form.validate();
    onSubmit(validateForm(form.state, form.config));
  };

  const context = {
    form,
    actions: {
      submit: handleSubmit,
    },
  };

  return (
    <FormContext.Provider value={context}>{children}</FormContext.Provider>
  );
};

export default FormProvider;
