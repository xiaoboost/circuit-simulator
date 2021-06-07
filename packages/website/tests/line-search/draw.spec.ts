import test from 'ava';

import { Line, LineData, Part, PartData } from 'src/components/electronics';
import { draw } from 'src/components/electronics/line-way';
import { loadSheet, parts } from 'src/store';

// console.log(loadSheet);

test('demo', ({ is, pass }) => {
  // loadSheet([
  //   {
  //     kind: 'Resistance',
  //     id: 'R_1',
  //     position: [100, 100],
  //   },
  // ]);

  pass();

  // is(parts.data.length, 1);
});
