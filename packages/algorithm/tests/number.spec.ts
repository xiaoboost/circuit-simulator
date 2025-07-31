import { describe, it, expect } from 'vitest';

import {
  getRank,
  toRound,
  splitNumber,
  parseShortNumber,
  toScientific,
  shortUnitList,
} from '../src';

describe('getRank()', () => {
  it('should return correct rank', () => {
    expect(getRank(0)).toBe(0);
    expect(getRank(100)).toBe(2);
    expect(getRank(0.001)).toBe(-3);
    expect(getRank(12.34)).toBe(1);
    expect(getRank(0.1234)).toBe(-1);
  });

  it('should throw error for NaN', () => {
    expect(() => getRank(NaN)).toThrow('(number) Cannot run getRank(NaN)');
  });
});

describe('toRound()', () => {
  it('should round numbers correctly', () => {
    expect(toRound(123456789)).toBe(123457000);
    expect(toRound(123.456789)).toBe(123.457);
    expect(toRound(-123.456789)).toBe(-123.457);
    expect(toRound(0.123456789)).toBe(0.123457);
    expect(toRound(0.00123456789)).toBe(0.00123457);
    expect(toRound(0.00123456789, 2)).toBe(0.0012);
    expect(toRound(-0.00123456789, 2)).toBe(-0.0012);
    expect(toRound(0.00123456789, 8)).toBe(0.0012345679);
  });

  it('should throw error for NaN', () => {
    expect(() => toRound(NaN)).toThrow('(number) Cannot run toRound(NaN)');
  });
});

describe('splitNumber()', () => {
  it('should split number with unit', () => {
    expect(splitNumber('123G')).toEqual({
      number: '123',
      rank: 'G',
    });
  });

  it('should split number without unit', () => {
    expect(splitNumber('456')).toEqual({
      number: '456',
      rank: '',
    });
  });

  it('should throw error for invalid input', () => {
    expect(() => splitNumber('123x')).toThrow('(number) Cannot run splitNumber(123x)');
  });
});

describe('parseShortNumber()', () => {
  it('should parse various number formats', () => {
    expect(parseShortNumber('123x')).toBe(NaN);
    expect(parseShortNumber('1234')).toBe(1234);
    expect(parseShortNumber('2e3')).toBe(2000);
    expect(parseShortNumber('2e-3')).toBe(0.002);
    expect(parseShortNumber('0.02M')).toBe(2e4);
    expect(parseShortNumber('0.02m')).toBe(2e-5);
    expect(parseShortNumber('200u')).toBe(2e-4);
  });
});

describe('toScientific()', () => {
  it('should convert to scientific notation', () => {
    expect(toScientific(10000)).toBe('10 k');
    expect(toScientific(0.002)).toBe('2 m');
    expect(toScientific(4e13)).toBe('40000 G');
    expect(toScientific(8.97e-14)).toBe('0.0897 p');
  });
});

describe('shortUnitList()', () => {
  it('should create unit list with custom suffix', () => {
    expect(shortUnitList(['G', 'm', 'μ'], 'x')).toEqual([
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
  });

  it('should create unit list with Chinese labels', () => {
    expect(shortUnitList(['G', 'm', 'μ'], 'yu', true)).toEqual([
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
  });

  it('should create default unit list', () => {
    expect(shortUnitList('yu')).toEqual([
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
});
