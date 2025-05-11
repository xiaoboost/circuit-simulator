import { Path, Segment } from './types';

/**
 * 计算两条折线的交点
 *
 * @description 排除端点相交，只计算中段相交
 */
export function getPathCoverPoints(...lines: Path[]) {
  // 水平线段
  const horizontalSegments: Segment[] = [];
  // 垂直线段
  const verticalSegments: Segment[] = [];

  // 收集线段
  for (const line of lines) {
    for (let j = 0; j < line.length - 1; j++) {
      const segment: Segment = [line[j], line[j + 1]];
      // 水平线段
      if (segment[0][1] === segment[1][1]) {
        // 水平线段以 X 轴坐标升序排序
        if (segment[0][0] > segment[1][0]) {
          [segment[0], segment[1]] = [segment[1], segment[0]];
        }
        horizontalSegments.push(segment);
      }
      // 垂直线段
      else if (segment[0][0] === segment[1][0]) {
        // 垂直线段以 Y 轴坐标升序排序
        if (segment[0][1] > segment[1][1]) {
          [segment[0], segment[1]] = [segment[1], segment[0]];
        }
        verticalSegments.push(segment);
      }
    }
  }

  // 水平线段以 Y 轴坐标升序排序
  horizontalSegments.sort((a, b) => a[0][1] - b[0][1]);
  // 垂直线段以 X 轴坐标升序排序
  verticalSegments.sort((a, b) => a[0][0] - b[0][0]);

  // 交叠点
  const points: [number, number][] = [];

  for (const horizontalSegment of horizontalSegments) {
    for (const verticalSegment of verticalSegments) {
      if (
        // 竖直线段的 X 轴坐标大于水平线段较大的 X 轴坐标
        verticalSegment[0][0] > horizontalSegment[1][0] ||
        // 水平线段的 Y 轴坐标大于竖直线段较大的 Y 轴坐标
        horizontalSegment[0][1] > verticalSegment[1][1]
      ) {
        break;
      }

      // 两个线段相交
      if (
        (
          // 竖直线段的 X 轴坐标小于水平线段较大的 X 轴坐标
          verticalSegment[0][0] <= horizontalSegment[1][0] &&
          // 竖直线段的 X 轴坐标大于水平线段较小的 X 轴坐标
          verticalSegment[0][0] >= horizontalSegment[0][0]
        ) &&
        (
          // 水平线段的 Y 轴坐标小于竖直线段较大的 Y 轴坐标
          horizontalSegment[0][1] <= verticalSegment[1][1] &&
          // 水平线段的 Y 轴坐标大于竖直线段较小的 Y 轴坐标
          horizontalSegment[0][1] >= verticalSegment[0][1]
        )
      ) {
        // 交叠节点，取竖直线段的 X 轴坐标和水平线段的 Y 轴坐标
        points.push([verticalSegment[0][0], horizontalSegment[0][1]]);
      }
    }
  }

  return points;
}
