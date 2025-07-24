import type { SearchNodeData } from '../a-star';
import type { RulesContext } from './types';
import { manhattanDistance } from './utils';

/**
 * 基础估值函数
 *
 * @description 曼哈顿距离 + 拐弯数量 * 20
 */
export function baseCost(this: RulesContext, node: SearchNodeData) {
  return (manhattanDistance(this.end, node.position) + node.junction * 20);
}
