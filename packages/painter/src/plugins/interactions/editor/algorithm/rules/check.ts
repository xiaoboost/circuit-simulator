import type { SearchNodeData } from '../a-star';
import type { RulesContext } from './types';

/**
 * 路径搜索节点是否有效
 *
 * @description 在导线和节点处会限制曼哈顿距离
 */
export function isValidNode(this: RulesContext, node: SearchNodeData): boolean {
  const { painter } = this;
  const { assert } = painter;
  const status = painter.getMarkAt(node.position);

  if (
    assert.isPart(status)
    || assert.isPartPinLine(status)
    || assert.isPartPin(status)
  ) {
    return false;
  }

  return true;
}
