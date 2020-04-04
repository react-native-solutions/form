# form

Form

## Installation

```sh
npm install @react-native-solutions/form
```

## Usage

```js
import { FormProvider, FormAction, useForm, Validators } from '@react-native-solutions/form';

const config = {
  validateOnChange: 'invalid', // 'always' | 'invalid' | 'none'
  validateOnInit: false,
  fields: {
    login: {
      initialValue: '',
      validate: {
        any: [
          'Login is bad :(',
          [
            ({ value }) => value.includes('@'),
            ({ value }) => value.includes('+380'),
          ],
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
      validate: {
        only: [
          'This should be checked!',
          ({ value }) => !!value,
        ],
      },
    },
  },
};

const extractNativeText = ({ nativeEvent: { text } }) => ({
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
              <Switch
                onValueChange={handleChange}
                value={value}
                style={{ width: 20, height: 20 }}
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
```

## `useForm` API

Stores form state in a reducer, generates Fields according to given `config`

See all possible `config` options in usage example.

```js
const EntireFromState = useForm(config);

const { Fields, state, reset, validate } = EntireFromState;
```

## `FormProvider` API

Provides a context for `Fields` & `FormAction`.

Props:
* `form`: FormState, result of `useForm` hook.
* `onSubmit`: Submit callback.

## `Field` API

Generated field called like configured but in UpperCamelCase.
Takes the only one `render` prop which is a function.

```jsx
const MyInput = ({ value, handleChange, validation }) => {
    ...
    return <SomeJSX />
}

<FormProvider form={EntireFormState} onSubmit={handleSubmit}>
    ...
    <Field.MyField render={MyInput} />
    ...
</FormProvider>
```

* `value` - field value
* `handleChange` - a function to change field state, takes a `StateExtractor` as parameter
*  `validation` - field validation state. Object with `valid: boolean` and `error: string[]` properties

### State extractors

State extractor is a function which helps to get the desired value from change event.

Takes any event from your input source and must return an object with `value` property.

Example for react-native `TextInput` onChange even:
```jsx
const extractNativeText = ({ nativeEvent: { text } }) => ({
  value: text,
});

// Somewhere in your input
<TextInput onChange={handleChange(extractNativeText)} />
```

If you haven't passed a `StateExtractor` to the `handleChange` it will treat upcoming event like a field value.

```jsx
<TextInput onTextChange={handleChange} />

// Similar to

<TextInput onTextChange={handleChange(text => ({ value: text )})} />
```

## `FormAction` API

A from action component.

```jsx
<FormProvider form={EntireFormState} onSubmit={handleSubmit}>
    ...
    <FormAction
      render={({ submit }) => (
        <Button label="submit" onPress={submit} />
      )}
     />
    ...
</FormProvider>
```

## License

MIT
