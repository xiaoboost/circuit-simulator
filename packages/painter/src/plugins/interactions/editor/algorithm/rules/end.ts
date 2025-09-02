import { SearchNodeData } from '../a-star';
import { RulesContext } from './types';

/** 等于终点 */
export function isEndPoint(this: RulesContext, node: SearchNodeData) {
  return this.end.isEqual(node.position);
}

/** 在终点等效线段中 */
export function isInEndLines(this: RulesContext, node: SearchNodeData) {
  return Boolean(findInEndLines.call(this, node));
}

/** 在终点等效线段中 */
function findInEndLines(this: RulesContext, node: SearchNodeData) {
  return this.endLines.find((line) => node.position.isInLine(line));
}

/** 绘制导线时，终点在导线中 */
export function checkNodeInLineWhenDraw(this: RulesContext, node: SearchNodeData) {
  // 优先判断是否等于终点
  if (node.position.isEqual(this.end)) {
    return (true);
  }

  // 是否在终点等效线段中
  const exLine = findInEndLines.call(this, node);

  // 不在等效终线中
  if (!exLine) {
    return false;
  }
  // 当前路径是直线
  if (!node.junction) {
    return true;
  }

  // 等效线段和当前节点方向平行
  if (exLine[1].add(exLine[0], -1).isParallelTo(node.direction)) {
    return true;
  }
  // 等效线段和当前节点方向垂直
  else {
    const junction = node.cornerParent.direction;
    const node2End = this.end.add(node.position, -1);

    return (node2End.isOppositeDirection(junction));
  }
}
