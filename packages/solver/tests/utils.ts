import type { DeepEqualAssertion } from 'ava';

import { MarkMap } from '@circuit/map';
import { Solver } from '../src/solver/solver';
import { snapshot as snapshot2 } from '@circuit/test';
import { Part, Line, PartData, LineData, Context } from '@circuit/electronics';

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

export function loadToData(data: (PartData | LineData)[]) {
  const context = load(data);
  const solver = new Solver({
    ...context,
    end: '10m',
    step: '10u',
  });

  const mapping = {
    node: solver.pinToNode.toData(),
    branch: solver.pinToBranch.toData(),
  };

  const observers = {
    current: solver.currentObservers.map((item) => ({
      id: item.id,
      matrix: item.matrix.toData(),
    })),
    voltage: solver.voltageObservers.map((item) => ({
      id: item.id,
      matrix: item.matrix.toData(),
    })),
  };

  const matrix = {
    factor: solver.factor.toData(),
    source: solver.source.toData(),
  };

  return {
    mapping,
    observers,
    matrix,
  };
}
