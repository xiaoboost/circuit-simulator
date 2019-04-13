import {
    getRank,
    toRound,
    splitNumber,
    numberParser,
    toScientific,
    createSelectList,
} from 'src/lib/number';

describe('number.ts: 数字相关的操作', () => {
    test('getRank(), 获取数字的数量级', () => {
        expect(getRank(0)).toBe(0);
        expect(getRank(100)).toBe(2);
        expect(getRank(0.001)).toBe(-3);
        expect(getRank(12.34)).toBe(1);
        expect(getRank(0.1234)).toBe(-1);

        expect(() => getRank(NaN)).toThrowError('(number) Cannot run getRank(NaN)');
    });
    test('toRound(), 以有效数字的位数对数字进行四舍五入', () => {
        expect(toRound(123456789)).toBe(123457000);
        expect(toRound(123.456789)).toBe(123.457);
        expect(toRound(-123.456789)).toBe(-123.457);
        expect(toRound(0.123456789)).toBe(0.123457);
        expect(toRound(0.00123456789)).toBe(0.00123457);
        expect(toRound(0.00123456789, 2)).toBe(0.0012);
        expect(toRound(-0.00123456789, 2)).toBe(-0.0012);
        expect(toRound(0.00123456789, 8)).toBe(0.0012345679);

        expect(() => toRound(NaN)).toThrowError('(number) Cannot run toRound(NaN)');
    });
    test('splitNumber(), 拆分科学计数法的简写单位和基本数字', () => {
        expect(splitNumber('123G')).toEqual({
            number: '123',
            rank: 'G',
        });

        expect(splitNumber('456')).toEqual({
            number: '456',
            rank: '',
        });

        expect(() => splitNumber('123x')).toThrowError('(number) Cannot run splitNumber(123x)');
    });
    test('numberParser(), 数字编译', () => {
        expect(numberParser('123x')).toBe(NaN);
        expect(numberParser('1234')).toBe(1234);
        expect(numberParser('2e3')).toBe(2000);
        expect(numberParser('2e-3')).toBe(0.002);
        expect(numberParser('0.02M')).toBe(2e4);
        expect(numberParser('0.02m')).toBe(2e-5);
        expect(numberParser('200u')).toBe(2e-4);
    });
    test('toScientific(), 数字简写', () => {
        expect(toScientific(10000)).toBe('10 k');
        expect(toScientific(0.002)).toBe('2 m');
        expect(toScientific(4e13)).toBe('40000 G');
        expect(toScientific(8.97e-14)).toBe('0.0897 p');
    });
    test('createSelectList(), 下拉列表选项生成器', () => {
        expect(createSelectList(['G', 'm', 'μ'], 'x')).toEqual([
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

        expect(createSelectList(['G', 'm', 'μ'], 'yu', true)).toEqual([
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

        expect(createSelectList('yu')).toEqual([
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
