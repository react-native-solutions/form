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

export const pipe = (...functions: Function[]) => {
  if (!functions.length) {
    return identity;
  }

  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduce((a, b) => (...args: any[]) => b(a(...args)));
};

export const union = <F extends Function>(...funcs: F[]) => (
  ...args: any[]
): any => funcs.map(f => f(...args)).reduce((a, single) => a && single, true);

export const disjunction = <F extends Function>(...funcs: F[]) => (
  ...args: any[]
): any => funcs.map(f => f(...args)).reduce((a, single) => a || single, false);
