import { Point } from '@circuit/algorithm';
import { SearchMode } from '../searcher';
import { isValidNode } from './check';
import { toPointCost } from './cost';
import { isEndPoint, isInEndLines } from './end';
import type {
  Rules,
  RulesOptions,
  RulesContext,
} from './types';
import { getSegment } from './utils';

const ThrowError = () => {
  throw new Error('方法未实现');
};

/** 创建搜索规则 */
export function createRules(options: RulesOptions): Rules {
  const { start, end, direction, painter, mode } = options;
  const context: RulesContext = {
    start,
    direction,
    painter,
    mode,
    end,
    endLines: [],
  };
  const rules: Rules = {
    cost: ThrowError,
    check: ThrowError,
    isEnd: ThrowError,
    getEnd: () => end ?? Point.Zero(),
  };

  // 线对齐模式
  if (mode === SearchMode.DrawAlignLine) {
    context.endLines = getSegment(painter, end);
    rules.cost = toPointCost.bind(context);
    rules.check = isValidNode.bind(context);
    rules.isEnd = isInEndLines.bind(context);
  }
  // 点对齐模式
  else if (mode === SearchMode.DrawAlignPoint || mode === SearchMode.DrawNormal) {
    rules.cost = toPointCost.bind(context);
    rules.check = isValidNode.bind(context);
    rules.isEnd = isEndPoint.bind(context);
  }

  return rules;
}
