import { SearchMode } from '../searcher';
import {
  isValidNode,
} from './check';
import {
  toPointCost,
  toLineCost,
} from './cost';
import {
  isEndPoint,
  // isInEndLines,
  // checkNodeInLineWhenDraw,
} from './end';
import type {
  Rules,
  RulesOptions,
  RulesContext,
} from './types';

const ThrowError = () => {
  throw new Error('方法未实现');
};

/** 创建搜索规则 */
export function createRules(options: RulesOptions): Rules {
  const context: RulesContext = {
    ...options,
    endLines: [],
  };
  const rules: Rules = {
    cost: ThrowError,
    check: ThrowError,
    isEnd: ThrowError,
  };

  // 绘制搜索
  if (options.mode < SearchMode.MoveNormal) {
    rules.cost = toPointCost.bind(context);
    rules.check = isValidNode.bind(context);
    rules.isEnd = isEndPoint.bind(context);
  }

  return rules;
}
