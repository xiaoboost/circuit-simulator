import {
  isValidNodeByNormal,
  isLegalPointAlign,
} from './check';
import { baseCost } from './cost';
import type {
  Rules,
  RulesOptions,
  RulesContext,
} from './types';

/** 创建搜索规则 */
export function createRules(options: RulesOptions): Rules {
  const context: RulesContext = {
    ...options,
    excludeParts: [],
    excludeLines: [],
    endLines: [],
  };

  return {
    cost: baseCost.bind(context),
    check: isValidNodeByNormal.bind(context),
    // isEnd: baseIsEnd,
  } as any;
}
