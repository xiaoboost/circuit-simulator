import test from 'ava';

import { noApartPart, apartPart } from './data';
import { loadToData } from './utils';

test('所有器件都是原始器件', ({ snapshot }) => {
  snapshot(loadToData(noApartPart));
});

test('含有拆分器件', ({ snapshot }) => {
  snapshot(loadToData(apartPart));
});
