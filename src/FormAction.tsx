import { ReactElement, useContext } from 'react';
import FormContext from './formContext';

export interface FormStateActions {
  submit: () => void;
}

interface FormActionProps {
  render: (
    actions: FormStateActions
  ) => ReactElement | ReactElement<(actions: FormStateActions) => ReactElement>;
}

export interface ActionRenderProps extends FormStateActions {}

const FormAction = ({ render }: FormActionProps) => {
  const { actions } = useContext(FormContext);

  const defaultAction: FormStateActions = {
    submit: () => {},
  };

  return render(actions || defaultAction);
};

export default FormAction;
