import type { DeepEqualAssertion } from 'ava';

import { dirname } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirpSync } from 'fs-extra';

export function snapshot(fsPath: string, actual: any, deep: DeepEqualAssertion) {
  if (existsSync(fsPath)) {
    const content = readFileSync(fsPath, 'utf-8');
    const data = JSON.parse(content);
    deep(actual, data);
  }
  else {
    mkdirpSync(dirname(fsPath));
    writeFileSync(fsPath, JSON.stringify(actual, null, 2) + '\n');
    deep(1, 1);
  }
}
