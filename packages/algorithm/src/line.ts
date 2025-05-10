import { Line, Segment } from './types';

/**
 * 计算两条折线的交点
 *
 * @description 排除端点相交，只计算中段相交
 */
export function getLineCoverPoints(...lines: Line[]) {
  // 水平线段
  const horizontalSegments: Segment[] = [];
  // 垂直线段
  const verticalSegments: Segment[] = [];

  // 收集线段
  for (const line of lines) {
    for (let i = 0; i < line.length - 1; i++) {
      const segment: Segment = [line[i], line[i + 1]];
      // 水平线段
      if (segment[0][1] === segment[1][1]) {
        horizontalSegments.push(segment);
      }
      // 垂直线段
      if (segment[0][0] === segment[1][0]) {
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
      // ..
    }
  }

  return points;
}
