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
import { FieldState } from '../../src/Field';
import { FormConfig } from '../../src/config';
import { Form, Field, useFormState } from '../../src';
import FormAction from '../../src/FormAction';
import { FormStateActions } from '../../src/useFormState';

const config: FormConfig = {
  validateOnChange: true,
  fields: {
    login: {
      initialValue: '',
      validate: {
        only: (value: any) => value === '123',
      },
    },
    password: {
      initialValue: '',
      validate: {
        every: [],
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
  const signInForm = useFormState(config);

  return (
    <View style={styles.container}>
      <Form state={signInForm} onSubmit={console.log}>
        <Field
          name="login"
          render={({ value, handleChange, valid }) => (
            <>
              <TextInput
                style={styles.textField}
                value={value}
                onChange={handleChange(extractNativeText)}
              />
              {!valid && <Text>This field is required</Text>}
            </>
          )}
        />
        <FormAction
          render={(actions: FormStateActions | undefined) =>
            actions && <Button title={'Sign In'} onPress={actions.submit} />
          }
        />
      </Form>
      {/*<Memoized render={renderField} />*/}
      {/*<SignInForm.Fields.PasswordField*/}
      {/*  render={({ value, handleChange, valid }: FieldProps<string>) => (*/}
      {/*    <>*/}
      {/*      <TextInput*/}
      {/*        value={value}*/}
      {/*        onChange={handleChange(extractNativeText)}*/}
      {/*      />*/}
      {/*      {!valid && <Text>This field is required</Text>}*/}
      {/*    </>*/}
      {/*  )}*/}
      {/*/>*/}
      {/*<SignInForm.Fields.PrivacyPolicyField*/}
      {/*  render={({ valid }: FieldProps<boolean>) => (*/}
      {/*    <>{!valid && <Text>This field is required</Text>}</>*/}
      {/*  )}*/}
      {/*/>*/}
      {/*<Button title="Sign In" onPress={signInForm} />*/}
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
