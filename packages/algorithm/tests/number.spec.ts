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
  it('零的位数应该是0', () => {
    expect(getRank(0)).toBe(0);
  });

  it('整数的位数应该正确', () => {
    expect(getRank(100)).toBe(2);
  });

  it('小数的位数应该正确', () => {
    expect(getRank(0.001)).toBe(-3);
    expect(getRank(12.34)).toBe(1);
    expect(getRank(0.1234)).toBe(-1);
  });

  it('NaN应该抛出异常', () => {
    expect(() => getRank(NaN)).toThrow('(number) Cannot run getRank(NaN)');
  });
});

describe('toRound()', () => {
  it('大整数应该正确四舍五入', () => {
    expect(toRound(123456789)).toBe(123457000);
  });

  it('正小数应该正确四舍五入', () => {
    expect(toRound(123.456789)).toBe(123.457);
    expect(toRound(0.123456789)).toBe(0.123457);
    expect(toRound(0.00123456789)).toBe(0.00123457);
  });

  it('负小数应该正确四舍五入', () => {
    expect(toRound(-123.456789)).toBe(-123.457);
    expect(toRound(-0.00123456789, 2)).toBe(-0.0012);
  });

  it('指定精度应该正确四舍五入', () => {
    expect(toRound(0.00123456789, 2)).toBe(0.0012);
    expect(toRound(0.00123456789, 8)).toBe(0.0012345679);
  });

  it('NaN应该抛出异常', () => {
    expect(() => toRound(NaN)).toThrow('(number) Cannot run toRound(NaN)');
  });
});

describe('splitNumber()', () => {
  it('带单位的数字应该正确分割', () => {
    expect(splitNumber('123G')).toEqual({
      number: '123',
      rank: 'G',
    });
  });

  it('不带单位的数字应该正确分割', () => {
    expect(splitNumber('456')).toEqual({
      number: '456',
      rank: '',
    });
  });

  it('无效输入应该抛出异常', () => {
    expect(() => splitNumber('123x')).toThrow('(number) Cannot run splitNumber(123x)');
  });
});

describe('parseShortNumber()', () => {
  it('无效格式应该返回NaN', () => {
    expect(parseShortNumber('123x')).toBe(NaN);
  });

  it('纯数字应该正确解析', () => {
    expect(parseShortNumber('1234')).toBe(1234);
  });

  it('科学计数法应该正确解析', () => {
    expect(parseShortNumber('2e3')).toBe(2000);
    expect(parseShortNumber('2e-3')).toBe(0.002);
  });

  it('带单位的大写字母应该正确解析', () => {
    expect(parseShortNumber('0.02M')).toBe(2e4);
  });

  it('带单位的小写字母应该正确解析', () => {
    expect(parseShortNumber('0.02m')).toBe(2e-5);
    expect(parseShortNumber('200u')).toBe(2e-4);
  });
});

describe('toScientific()', () => {
  it('大数应该转换为科学计数法', () => {
    expect(toScientific(10000)).toBe('10 k');
    expect(toScientific(4e13)).toBe('40000 G');
  });

  it('小数应该转换为科学计数法', () => {
    expect(toScientific(0.002)).toBe('2 m');
    expect(toScientific(8.97e-14)).toBe('0.0897 p');
  });
});

describe('shortUnitList()', () => {
  it('自定义单位列表应该正确生成', () => {
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

  it('中文标签应该正确生成', () => {
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

  it('默认单位列表应该正确生成', () => {
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
