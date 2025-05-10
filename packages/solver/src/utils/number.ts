import { parseShortNumber } from '@circuit/algorithm';
import { isNumber } from '@xiao-ai/utils';

export function parseNumber(num: number | string) {
  return isNumber(num) ? num : parseShortNumber(num);
}
