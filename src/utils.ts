export type AnyFunction = (...args: any[]) => any;

export const identity = (a: any) => a;

export const compose = (...functions: Function[]) => {
  if (!functions.length) {
    return identity;
  }

  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduce((a, b) => (...args: any[]) => a(b(...args)));
};

export const pipe = (...functions: AnyFunction[]) => {
  if (!functions.length) {
    return identity;
  }

  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduce((a, b) => (...args: any[]) => b(a(...args)));
};
