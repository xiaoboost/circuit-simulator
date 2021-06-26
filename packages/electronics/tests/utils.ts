import type { DeepEqualAssertion } from 'ava';
import type { MarkMap } from '@circuit/map';

import { snapshot as snapshot2 } from '@circuit/test';
import { Line, Part, LineData, PartData } from '../src';

import * as path from 'path';

function resolve(...paths: string[]) {
  return path.join(__dirname, '..', ...paths);
}

function resolveSnapshot(name: string) {
  return resolve('tests/snapshots', `${name}.json`);
}

export function snapshot(name: string, actual: any, deep: DeepEqualAssertion) {
  snapshot2(resolveSnapshot(name), actual, deep);
}

/** 放置器件 */
export function loadParts(data: Partial<PartData>[], map: MarkMap, space: boolean) {
  const parts: Part[] = [];

  data.forEach((item) => {
    const part = new Part(item as PartData);
    (part as any).map = map;
    parts.push(part);

    if (!space) {
      part.setMark();
    }
  });

  return parts;
}

/** 放置导线 */
export function loadLines(data: Partial<LineData>[], map: MarkMap, space: boolean) {
  const lines: Line[] = [];

  data.forEach((item) => {
    const line = new Line(item.path);
    (line as any).map = map;
    lines.push(line);

    if (!space) {
      line.setMark();
      line.setConnectionByPath(false);
    }
  });

  return lines;
}
