import { pipe } from './utils';

export const toCamelCase = (str: string) =>
  str
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    });

export const upperFirst = (str: string) => {
  const charArr = str.split('');
  charArr.splice(0, 1, str[0].toUpperCase());

  return charArr.join('');
};

export const toUpperCamelCase = pipe(toCamelCase, upperFirst);
