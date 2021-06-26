import { parseShortNumber } from '@circuit/math';
import { isNumber } from '@xiao-ai/utils';

export function parseNumber(num: number | string) {
  return isNumber(num) ? num : parseShortNumber(num);
}
