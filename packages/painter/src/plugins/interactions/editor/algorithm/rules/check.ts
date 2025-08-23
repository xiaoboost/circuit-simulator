import type { SearchNodeData } from '../a-star';
import type { RulesContext } from './types';

/**
 * 路径搜索节点是否有效
 *
 * @description 在导线和节点处会限制曼哈顿距离
 */
export function isValidNode(this: RulesContext, node: SearchNodeData): boolean {
  const { painter } = this;
  const status = painter.get(node.position);

  if (status && (painter.isPart(status) || painter.isPartPinLine(status))) {
    return false;
  }

  return true;
}
