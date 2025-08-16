import type { Point } from '@circuit/algorithm';
import { Map, Mark, type MarkMap } from '../../constant';
import type { SearchNodeData } from '../a-star';

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

  // TODO: 临时返回 true，等待实现
  return true;
}
