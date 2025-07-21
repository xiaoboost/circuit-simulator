import { Map, Mark } from '../../map';
import type { SearchNodeData } from '../point-search';
import type { RulesContext } from './types';
import { manhattanDistance as distance, isNodeInLine, isNodeVerticalLine } from './utils';

/**
 * 路径搜索节点是否有效
 *
 * @description 在导线和节点处会限制曼哈顿距离
 */
function isValidNode(this: RulesContext, node: SearchNodeData, pointLimit: number): boolean {
  const { map } = this;
  const status = Map.get(map, node.position);

  // 空节点
  if (!status) {
    return true;
  }
  else if (Mark.isPart(status)) {
    return this.excludeParts.includes(status.id);
  }
  else if (Mark.isPartPin(status)) {
    // 在距离范围内的都可以
    return (
      this.excludeParts.includes(status.id) ||
      distance(node.position, this.end) < pointLimit
    );
  }
  else if (Mark.isLinePoint(status)) {
    return (
      this.excludeLines.some((line) => isNodeInLine(node.position, line)) ||
      distance(node.position, this.end) < pointLimit
    );
  }
  // 导线
  else if (Mark.isLine(status)) {
    // 当前节点方向必须和所在导线方向垂直
    return (isNodeVerticalLine(this.map, node));
  }
  else {
    return true;
  }
}

/** 普通情况时的节点判断 */
export function isValidNodeByNormal(this: RulesContext, node: SearchNodeData): boolean {
  return isValidNode.call(this, node, 2);
}

/** 强制对齐时的节点判断 */
export function isLegalPointAlign(this: RulesContext, node: SearchNodeData) {
  return isValidNode.call(this, node, 1);
}
