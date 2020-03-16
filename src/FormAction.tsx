import { ReactElement, useContext } from 'react';
import { FormStateActions } from './useFormState';
import FormContext from './formContext';

interface FormActionProps {
  render: (
    actions: FormStateActions | undefined
  ) => ReactElement | null | false;
}

const FormAction = ({ render }: FormActionProps) => {
  const { actions } = useContext(FormContext);

  return render(actions);
};

export default FormAction;
