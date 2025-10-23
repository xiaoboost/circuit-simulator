import {
  Point,
  Direction,
  DirectionVectorSet,
  SegmentWithPoint as Segment,
} from '@circuit/algorithm';
import type { SearchNodeData } from '../a-star';
import type { IPainterAdapter } from '../searcher';

/** 返回节点所在器件 */
export function getPart(painter: IPainterAdapter, node: Point) {
  const { assert } = painter;
  const status = painter.getMarkAt(node);

  if (assert.isPart(status) || assert.isPartPin(status)) {
    return status.id;
  }
}

/** 返回节点所在线段 */
export function getSegment(painter: IPainterAdapter, node: Point) {
  const { assert, mark } = painter;
  const data = painter.getMarkAt(node);

  if (!data || !assert.isLineAndLine(data)) {
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
      mark.alongLineAndVector(data, Point.from(directors[i * 2])),
      mark.alongLineAndVector(data, Point.from(directors[i * 2 + 1])),
    ];

    if (!limit[0].position.isEqual(limit[1].position)) {
      ans.push(limit.map(({ position }) => position) as Segment);
    }
  }

  return ans;
}

/** 节点所在线段是否和当前节点方向垂直 */
export function isNodeVerticalLine(painter: IPainterAdapter, node: SearchNodeData): boolean {
  const status = painter.getMarkAt(node.position);

  if (!status || painter.mark.isNoConnect(status)) {
    return false;
  }

  // return status.connections.every(
  //   (connect) =>
  //     connect.add(node.position, -1).isVertical(node.direction),
  // );

  // TODO: 临时返回 true，等待实现
  return true;
}
