import type { Point } from '@circuit/algorithm';
import type { MarkMap } from '../../../../../types';
import { Map, Mark } from '../../map';
import type { SearchNodeData } from '../point-search';

/** 返回节点所在器件 */
export function getPart(map: MarkMap, node: Point) {
  const status = Map.get(map, node);

  if (!status) {
    return;
  }

  if (Mark.isPart(status) || Mark.isPartPin(status)) {
    return status.id;
  }
}

/** 返回节点所在线段 */
export function getSegment(map: MarkMap, node: Point) {
  const data = Map.get(map, node);

  if (!data || !Mark.isLineAndPoint(data)) {
    return;
  }

  const ans: [Point, Point][] = [];

  for (let i = 0; i < 2; i++) {
    const directors = [[1, 0], [-1, 0], [0, -1], [0, 1]];
    const limit = [
      Mark.alongLineAndVector(data, directors[i * 2], map),
      Mark.alongLineAndVector(data, directors[i * 2 + 1], map),
    ];

    if (!limit[0].position.isEqual(limit[1].position)) {
      ans.push(limit.map(({ position }) => position) as [Point, Point]);
    }
  }

  return ans;
}

/** 节点是否在线段内 */
export function isNodeInLine(node: Point, line: [Point, Point]) {
  return node.isInLine(line);
}

/** 曼哈顿距离 */
export function manhattanDistance(a: Point, b: Point) {
  return (
    Math.abs(a[0] - b[0]) +
    Math.abs(a[1] - b[1])
  );
}

/** 节点所在线段是否和当前节点方向垂直 */
export function isNodeVerticalLine(map: MarkMap, node: SearchNodeData): boolean {
  const status = Map.get(map, node.position);

  if (!status || Mark.isNoConnect(status)) {
    return false;
  }

  // return status.connections.every(
  //   (connect) =>
  //     connect.add(node.position, -1).isVertical(node.direction),
  // );

  // 临时返回 true，等待实现
  return true;
}
