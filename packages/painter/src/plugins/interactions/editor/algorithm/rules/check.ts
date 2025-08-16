import { Map, Mark } from '../../constant';
import type { SearchNodeData } from '../a-star';
import type { RulesContext } from './types';

/**
 * 路径搜索节点是否有效
 *
 * @description 在导线和节点处会限制曼哈顿距离
 */
export function isValidNode(this: RulesContext, node: SearchNodeData): boolean {
  const { map } = this;
  const status = Map.get(map, node.position);

  if (status && (Mark.isPart(status) || Mark.isPartPinLine(status))) {
    return false;
  }

  return true;
}
