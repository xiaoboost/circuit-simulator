/**
 * 简写数字正则匹配
 *
 * @example
 *   1G = 1e9
 *   1M = 1e6
 *   1k = 1e3
 *   1m = 1e-3
 *   1u = 1e-6
 *   1n = 1e-9
 *   1p = 1e-12
 */
export const numberMatcher = /^\d+(?:\.\d+)?$|^\d+?(?:\.\d+)?[eE]-?\d+$|^\d+(?:\.\d+)?[puμnmkMG]$/;

/** 简写数字编译 */
export function numberParser(notation: string) {
    if (!numberMatcher.test(notation)) {
        return NaN;
    }
    else if (/[eE]/.test(notation)) {
        const [base, power] = notation.split(/[eE]/);
        return Number(base) * Math.pow(10, Number(power));
    }
    else if (/[puμnmkMG]$/.test(notation)) {
        const exp = { p: -12, u: -9, μ: -9, n: -6, m: -3, k: 3, M: 6, G: 9 };
        const power = exp[notation[notation.length - 1]] as number;
        const base = notation.substring(0, notation.length - 1);

        return Number(base) * Math.pow(10, power);
    }
    else {
        return Number(notation);
    }
}

type NumberUnit = 'p' | 'n' | 'u' | 'μ' | 'm' | '' | 'k' | 'M' | 'G';

/** 生成简写单位下拉列表选项 */
export function createSelectList(units: NumberUnit[], label: string) {
    const unitFilted: Exclude<NumberUnit, 'μ'>[] = units.map((unit) => unit === 'μ' ? 'u' : unit);
    const unitMap = {
        'p': '皮',
        'n': '纳',
        'u': '微',
        'm': '毫',
        '': '',
        'k': '千',
        'M': '兆',
        'G': '吉',
    };

    return unitFilted.map((unit) => ({
        label: `${unitMap[unit]}${label}`,
        value: unit,
    }));
}
