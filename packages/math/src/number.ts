import { isArray } from '@xiao-ai/utils';
import BigNumber from 'bignumber.js';

/** 数字数量级简写 */
enum RankEnum {
  p = -12,
  n = -9,
  μ = -6,
  m = -3,
  k = 3,
  M = 6,
  G = 9,
  '' = 0,
}

export { BigNumber };

/**
 * 普通数字匹配
 *  - 10
 *  - 12.5
 */
export const normalNumberMatcher = /^\d+(?:\.\d+)?$/;
/**
 * 对数数字匹配
 *  - 10e4
 *  - 2e-5
 *  - 1.5e6
 */
export const expNumberMatcher = /^\d+?(?:\.\d+)?[eE]-?\d+$/;
/**
 * 简写数字匹配
 *  - 10u
 *  - 20M
 *  - 1.5k
 */
export const shortNumberMatcher = /^\d+(?:\.\d+)?[puμnmkMG]$/;

/** 所有数字匹配 */
export const numberMatcher = new RegExp(
  `${normalNumberMatcher.source}|` +
  `${expNumberMatcher.source}|` +
  `${shortNumberMatcher.source}`
);

/** 简写数字编译 */
export function parseShortNumber(notation: string) {
  let bigNum: BigNumber;

  if (!numberMatcher.test(notation)) {
    bigNum = new BigNumber(NaN);
  }
  else if (/[eE]/.test(notation)) {
    const [base, power] = notation.split(/[eE]/);
    bigNum = new BigNumber(base).multipliedBy(Math.pow(10, Number(power)));
  }
  else if (/[puμnmkMG]$/.test(notation)) {
    const base = notation.substring(0, notation.length - 1);
    const rankOri = notation[notation.length - 1];
    const rank = rankOri === 'u' ? 'μ' : rankOri;
    const power = RankEnum[rank];

    bigNum = new BigNumber(base).multipliedBy(Math.pow(10, power));
  }
  else {
    bigNum = new BigNumber(notation);
  }

  return bigNum.toNumber();
}

/** 简写数字单位 */
export type NumberRank = 'G' | 'M' | 'k' | '' | 'm' | 'μ' | 'u' | 'n' | 'p';

/** 简写数字快捷选项下拉列表 */
export type SelectList = Array<{
  label: string;
  value: string;
}>;

/** 简写数字对应的中文 */
const unitMap: Record<NumberRank, string> = {
  'p': '皮',
  'n': '纳',
  'u': '微',
  'μ': '微',
  'm': '毫',
  '': '',
  'k': '千',
  'M': '兆',
  'G': '吉',
};

/** 所有数量级 */
export const allRanks = ['G', 'M', 'k', '', 'm', 'u', 'n', 'p'] as NumberRank[];

/** 生成简写数字单位快捷选择列表选项 */
export function shortUnitList(unit: string, isChinese?: boolean): SelectList;
export function shortUnitList(ranks: NumberRank[], unit: string, isChinese?: boolean): SelectList;
export function shortUnitList(ranks: NumberRank[] | string, unit?: string | boolean, isChinese = false) {
  // 未输入单位列表
  if (!isArray(ranks)) {
    isChinese = Boolean(unit);
    unit = ranks;
    ranks = allRanks;
  }

  return ranks.map((origin) => {
    const rank = origin === 'μ' ? 'u' : origin;
    const label = origin === 'u' ? 'μ': origin;

    return {
      label: isChinese
        ? `${unitMap[rank]}${unit}`
        : `${label}${unit}`,
      value: rank,
    };
  });
}

/** 解析输入数字 */
export function splitNumber(str: string) {
  const matcher = /^([\d.]+)([GMkmuμnp]?)$/;
  const match = matcher.exec(str);

  if (!match) {
    throw new Error(`(number) Cannot run splitNumber(${str})`);
  }

  let rank = match[2] as NumberRank;

  if (rank === 'μ') {
    rank = 'u';
  }

  return {
    number: match[1],
    rank,
  };
}

/**
 * 求数字的数量级
 *
 * @returns {number}
 */
export function getRank(value: number) {
  if (Number.isNaN(value)) {
    throw new Error('(number) Cannot run getRank(NaN)');
  }

  if (value === 0) {
    return 0;
  }

  return Math.floor(Math.log10(Math.abs(value)));
}

/**
 * 按照有效数字的位数进行四舍五入。
 *  - 默认 6 位有效数字 [bits=6]
 *
 * @param {number} [bits=6]
 * @returns {number}
 */
export function toRound(origin: number, bits = 6) {
  if (Number.isNaN(origin)) {
    throw new Error('(number) Cannot run toRound(NaN)');
  }

  const value = Math.abs(origin);
  const toInt = Math.floor(Math.log10(value)) - bits + 1;
  const transform = 10 ** toInt;
  // round 一定是整数
  const round = String(Math.round(value / transform));
  // 原始数据符号
  const sign = origin < 0 ? '-' : '';

  // 插入小数点
  let str = '';
  if (toInt > 0) {
    str = round + '0'.repeat(toInt);
  }
  else if (-toInt >= bits) {
    str = `0.${'0'.repeat(-toInt - bits)}${round}`;
  }
  else {
    str = `${round.slice(0, toInt)}.${round.slice(toInt)}`;
  }

  return Number.parseFloat(sign + str);
}

/** 将数字转换为科学计数法 */
export function toScientific(num: number) {
  /** 输入数字的数量级 */
  const rank = getRank(num);

  /** 3 整数倍 */
  let thirdRank = Math.floor(rank / 3) * 3;

  if (thirdRank > 9) {
    thirdRank = 9;
  }
  else if (thirdRank < -12) {
    thirdRank = -12;
  }

  /** 剩余的数字 */
  const base = new BigNumber(num).dividedBy(Math.pow(10, thirdRank));

  return `${base.toNumber()} ${RankEnum[thirdRank]}`;
}

/** 解析对数增益 */
export function parseGainNumber(db: number) {
  return Math.pow(10, (db / 20));
}
