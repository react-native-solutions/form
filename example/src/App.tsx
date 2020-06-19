import * as React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Switch,
} from 'react-native';
import { FieldState } from 'src/createField';
import { FormStateActions } from 'src/FormAction';
import {
  FormProvider,
  FormAction,
  useForm,
  Validators,
  FormConfig,
} from '../../src/index';

const config: FormConfig = {
  validateOnChange: 'invalid',
  validateOnInit: false,
  fields: {
    login: {
      initialValue: '',
      validate: ({ value }, done, error) => {
        if (!value.includes('@') || !value.includes('+380')) {
          return error('Login is bad :(');
        }

        return done();
      },
    },
    password: {
      initialValue: '',
      validate: (state, done, error) => {
        if (!Validators.email(state)) {
          return error('asdasd');
        }

        if (!Validators.maxLength(8)(state)) {
          return error('Password is too long');
        }

        return done();
      },
    },
    privacyPolicy: {
      initialValue: false,
      validate: ({ value }, done, error) => {
        if (!value) {
          return error('This field is required');
        }

        return done();
      },
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
              <Switch onValueChange={handleChange} value={value} />
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

export default App;
