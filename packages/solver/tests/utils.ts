import type { DeepEqualAssertion } from 'ava';

import { MarkMap } from '@circuit/map';
import { Part, Line, PartData, LineData, Context } from '@circuit/electronics';
import { snapshot as snapshot2 } from '@circuit/test';

export function snapshot(name: string, actual: any, deep: DeepEqualAssertion) {
  snapshot2(__dirname, name, actual, deep);
}

export function load(data: (PartData | LineData)[]) {
  const context: Context = {
    parts: [],
    lines: [],
    map: new MarkMap(),
  };

  data
    .filter((item) => item.kind !== 'Line')
    .forEach((item) => {
      const part = new Part(item as any, context);
      part.setMark();
    });

  data
    .filter((item) => item.kind === 'Line')
    .forEach((item) => {
      const line = new Line((item as LineData).path, context);
      line.setMark();
      line.setConnectionByPath(false);
    });

  return context;
}
