import test from 'ava';

import { loadToData } from './utils';
import { noApartPart, apartPart } from './data';

test('所有器件都是原始器件', ({ snapshot }) => {
  snapshot(loadToData(noApartPart));
});

test('含有拆分器件', ({ snapshot }) => {
  snapshot(loadToData(apartPart));
});
