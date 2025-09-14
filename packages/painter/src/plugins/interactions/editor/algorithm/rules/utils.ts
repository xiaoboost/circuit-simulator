import {
  Point,
  Direction,
  DirectionVectorSet,
  SegmentWithPoint as Segment,
} from '@circuit/algorithm';
import type { SearchNodeData } from '../a-star';
import type { PainterState } from '../searcher';

/** 返回节点所在器件 */
export function getPart(painter: PainterState, node: Point) {
  const status = painter.get(node);

  if (painter.isPart(status) || painter.isPartPin(status)) {
    return status.id;
  }
}

/** 返回节点所在线段 */
export function getSegment(painter: PainterState, node: Point) {
  const data = painter.get(node);

  if (!data || !painter.isLineAndLine(data)) {
    return [];
  }

  const ans: Segment[] = [];

  for (let i = 0; i < 2; i++) {
    const directors = [
      DirectionVectorSet[Direction.Right],
      DirectionVectorSet[Direction.Left],
      DirectionVectorSet[Direction.Top],
      DirectionVectorSet[Direction.Bottom],
    ];

    const limit = [
      painter.alongLineAndVector(data, Point.from(directors[i * 2])),
      painter.alongLineAndVector(data, Point.from(directors[i * 2 + 1])),
    ];

    if (!limit[0].position.isEqual(limit[1].position)) {
      ans.push(limit.map(({ position }) => position) as Segment);
    }
  }

  return ans;
}

/** 节点所在线段是否和当前节点方向垂直 */
export function isNodeVerticalLine(painter: PainterState, node: SearchNodeData): boolean {
  const status = painter.get(node.position);

  if (!status || painter.isNoConnect(status)) {
    return false;
  }

  // return status.connections.every(
  //   (connect) =>
  //     connect.add(node.position, -1).isVertical(node.direction),
  // );

  // TODO: 临时返回 true，等待实现
  return true;
}
