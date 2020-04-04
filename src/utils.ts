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

export const pipe = <T = any>(...functions: ((arg: T) => T)[]) => {
  if (!functions.length) {
    return identity;
  }

  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduce((a, b) => (arg: T) => b(a(arg)));
};
