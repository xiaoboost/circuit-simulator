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
  isInEndLines,
  // checkNodeInLineWhenDraw,
} from './end';
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
  const context: RulesContext = {
    ...options,
    endLines: [],
  };
  const rules: Rules = {
    cost: ThrowError,
    check: ThrowError,
    isEnd: ThrowError,
  };

  const { mode, end, painter } = options;

  // 线对齐模式
  if (mode === SearchMode.DrawAlignLine) {
    const endLines = getSegment(painter, end);

    if (!endLines || endLines.length === 0) {
      throw new Error('终点不在导线上');
    }

    context.endLines = endLines;

    rules.cost = toLineCost.bind(context);
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
