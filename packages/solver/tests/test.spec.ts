import test from 'ava';

import { snapshot, load } from './utils';
import { Solver } from '../src/solver/solver';
import { noApartPart } from './data';

test('所有器件都是原始器件', ({ deepEqual }) => {
  const context = load(noApartPart);
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

  snapshot('normal-electronics-mapping', mapping, deepEqual);
  snapshot('normal-electronics-observers', observers, deepEqual);
  snapshot('normal-electronics-matrix', matrix, deepEqual);
});
