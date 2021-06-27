import test from 'ava';

import { snapshot, loadToData } from './utils';
import { noApartPart, apartPart } from './data';

test('所有器件都是原始器件', ({ deepEqual }) => {
  snapshot('normal', loadToData(noApartPart), deepEqual);
});

test('含有拆分器件', ({ deepEqual }) => {
  snapshot('apart', loadToData(apartPart), deepEqual);
});
