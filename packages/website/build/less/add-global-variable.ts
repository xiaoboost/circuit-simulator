import { resolve } from '../utils';
import type { Transformer } from './types';

export const addGlobalVariables: Transformer = (code) => {
  return `@import "${resolve('src/styles/constant.less')}";\n` + code;
};