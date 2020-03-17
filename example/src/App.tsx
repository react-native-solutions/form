import * as React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { FieldState } from '../../src/createField';
import { FormConfig } from '../../src/config';
import { FormProvider, useForm, Validators } from '../../src';
import FormAction from '../../src/FormAction';
import { FormStateActions } from '../../src/FormAction';

const config: FormConfig = {
  validateOnChange: true,
  fields: {
    login: {
      initialValue: '',
      validate: {
        any: [
          ['Login is bad :(', ({ value }) => value.includes('@')],
          ['Login is bad :(', ({ value }) => value.includes('+380')],
        ],
      },
    },
    password: {
      initialValue: '',
      validate: {
        every: [
          ['Password is too short', Validators.minLength(4)],
          ['Password is too long', Validators.maxLength(8)],
        ],
      },
    },
    privacyPolicy: {
      initialValue: false,
    },
  },
};

const extractNativeText = ({
  nativeEvent: { text },
}: NativeSyntheticEvent<TextInputChangeEventData>): FieldState<string> => ({
  value: text,
});

function App() {
  const SignInForm = useForm(config);

  const { Fields } = SignInForm;
  return (
    <View style={styles.container}>
      <FormProvider form={SignInForm} onSubmit={console.log}>
        <Fields.LoginField
          render={({ value, handleChange, validation }) => (
            <>
              <TextInput
                style={styles.textField}
                value={value}
                onChange={handleChange(extractNativeText)}
              />
              {!validation.valid && <Text>{validation.errors[0]}</Text>}
            </>
          )}
        />
        <Fields.PasswordField
          render={({ value, handleChange, validation }) => (
            <>
              <TextInput
                style={styles.textField}
                value={value}
                onChange={handleChange(extractNativeText)}
              />
              {!validation.valid && <Text>{validation.errors[0]}</Text>}
            </>
          )}
        />
        <Fields.PrivacyPolicyField
          render={({ value, handleChange, validation }) => (
            <>
              <TextInput
                style={styles.textField}
                value={value}
                onChange={handleChange(extractNativeText)}
              />
              {!validation.valid && <Text>{validation.errors[0]}</Text>}
            </>
          )}
        />
        <FormAction
          render={(actions: FormStateActions) =>
            actions && <Button title={'Sign In'} onPress={actions.submit} />
          }
        />
      </FormProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textField: {
    height: 40,
    width: 300,
    margin: 5,
    borderRadius: 8,
    padding: 4,
    backgroundColor: '#ffa062',
  },
});

export default React.memo(App, () => true);
