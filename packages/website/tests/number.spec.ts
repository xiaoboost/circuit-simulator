import test from 'ava';

import {
  getRank,
  toRound,
  splitNumber,
  numberParser,
  toScientific,
  shortUnitList,
} from 'src/math';

test('getRank()', ({ is, throws }) => {
  is(getRank(0), 0);
  is(getRank(100), 2);
  is(getRank(0.001), -3);
  is(getRank(12.34), 1);
  is(getRank(0.1234), -1);
  throws(() => getRank(NaN), null, '(number) Cannot run getRank(NaN)');
});

test('toRound()', ({ is, throws }) => {
  is(toRound(123456789), 123457000);
  is(toRound(123.456789), 123.457);
  is(toRound(-123.456789), -123.457);
  is(toRound(0.123456789), 0.123457);
  is(toRound(0.00123456789), 0.00123457);
  is(toRound(0.00123456789, 2), 0.0012);
  is(toRound(-0.00123456789, 2), -0.0012);
  is(toRound(0.00123456789, 8), 0.0012345679);
  throws(() => toRound(NaN), null, '(number) Cannot run toRound(NaN)');
});

test('splitNumber()', ({ deepEqual, throws }) => {
  deepEqual(splitNumber('123G'), {
    number: '123',
    rank: 'G',
  });

  deepEqual(splitNumber('456'), {
    number: '456',
    rank: '',
  });

  throws(() => splitNumber('123x'), null, '(number) Cannot run splitNumber(123x)');
});

test('numberParser()', ({ is }) => {
  is(numberParser('123x'), NaN);
  is(numberParser('1234'), 1234);
  is(numberParser('2e3'), 2000);
  is(numberParser('2e-3'), 0.002);
  is(numberParser('0.02M'), 2e4);
  is(numberParser('0.02m'), 2e-5);
  is(numberParser('200u'), 2e-4);
});

test('toScientific()', ({ is }) => {
  is(toScientific(10000), '10 k');
  is(toScientific(0.002), '2 m');
  is(toScientific(4e13), '40000 G');
  is(toScientific(8.97e-14), '0.0897 p');
});

test('createSelectList()', ({ deepEqual }) => {
  deepEqual(shortUnitList(['G', 'm', 'μ'], 'x'), [
    {
      label: 'Gx',
      value: 'G',
    },
    {
      label: 'mx',
      value: 'm',
    },
    {
      label: 'μx',
      value: 'u',
    },
  ]);

  deepEqual(shortUnitList(['G', 'm', 'μ'], 'yu', true), [
    {
      label: '吉yu',
      value: 'G',
    },
    {
      label: '毫yu',
      value: 'm',
    },
    {
      label: '微yu',
      value: 'u',
    },
  ]);

  deepEqual(shortUnitList('yu'), [
    {
      label: 'Gyu',
      value: 'G',
    },
    {
      label: 'Myu',
      value: 'M',
    },
    {
      label: 'kyu',
      value: 'k',
    },
    {
      label: 'yu',
      value: '',
    },
    {
      label: 'myu',
      value: 'm',
    },
    {
      label: 'μyu',
      value: 'u',
    },
    {
      label: 'nyu',
      value: 'n',
    },
    {
      label: 'pyu',
      value: 'p',
    },
  ]);
});
