import type { SearchNodeData } from '../a-star';
import type { RulesContext } from './types';

/**
 * 点估值
 *
 * @description 曼哈顿距离 + 拐弯数量 * 20
 */
export function toPointCost(this: RulesContext, node: SearchNodeData) {
  return (this.end.manhattanDistance(node.position) + node.junction * 20);
}

/**
 * 线估值
 *
 * @description 到最近线段的距离 + 拐弯数量 * 20
 */
export function toLineCost(this: RulesContext, node: SearchNodeData) {
  if (!this.endLines || this.endLines.length === 0) {
    // 如果没有目标线段，回退到点估值
    return toPointCost.call(this, node);
  }

  // 找到最近的线段
  let minDistance = Infinity;

  for (const line of this.endLines) {
    const distance = node.position.manhattanDistanceToSegment(line);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance + node.junction * 20;
}
