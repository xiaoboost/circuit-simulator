import { resolve } from '../utils';
import type { Transformer } from './types';

export const addGlobalVariables: Transformer = (code, rootDir) => {
  return `@import "${resolve(rootDir, 'src/styles/constant.less')}";\n` + code;
};
