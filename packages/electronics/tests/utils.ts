import type { DeepEqualAssertion } from 'ava';

import * as fs from 'fs';
import * as path from 'path';

function resolve(...paths: string[]) {
  return path.join(__dirname, '..', ...paths);
}

function resolveSnapshot(name: string) {
  return resolve('tests/snapshots', `${name}.json`);
}

export function snapshot(name: string, actual: any, deep: DeepEqualAssertion) {
  const content = fs.readFileSync(resolveSnapshot(name), 'utf-8');
  const data = JSON.parse(content);
  deep(actual, data);
}
