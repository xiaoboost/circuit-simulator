import { addGlobalVariables } from './add-global-variable';
import { importTsTransform } from './import-ts-transformer';
import type { Transformer } from './types';

export const transformers: Transformer[] = [
  addGlobalVariables,
  importTsTransform,
];

export async function transformLess(code: string, rootDir: string, resourcePath: string) {
  let result = code;

  for (const transformer of transformers) {
    result = await transformer(result, rootDir, resourcePath);
  }

  return result;
}
