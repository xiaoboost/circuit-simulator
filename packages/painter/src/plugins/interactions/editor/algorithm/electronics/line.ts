import {
  Point,
  type PointLike,
  type PathWithPoint,
  type SegmentWithPoint,
} from '@circuit/algorithm';
import { copyLine } from '@circuit/electronics';
import type {
  LineStructuredData,
  LineWithPin,
  LineWithIndex,
  StructuredData,
} from '@circuit/types';

/**
 * 去除节点冗余
 *  - 相邻三点共线或者相邻两点相等
 *
 * @description 返回新导线
 */
export function removeRepeat(path: PathWithPoint) {
  const newPath = copyLine(path);

  for (let i = 0; i < newPath.length - 2; i++) {
    if (
      ((newPath[i][0] === newPath[i + 1][0]) && (newPath[i + 1][0] === newPath[i + 2][0]))
      || ((newPath[i][1] === newPath[i + 1][1]) && (newPath[i + 1][1] === newPath[i + 2][1]))
      || ((newPath[i][0] === newPath[i + 1][0]) && (newPath[i][1] === newPath[i + 1][1]))
    ) {
      newPath.splice(i + 1, 1);
      i -= 2;

      if (i < -1) {
        i = -1;
      }
    }
  }

  return newPath;
}

/**
 * 导线形状相似
 *  - 节点数量相同
 *  - 只有最后两个节点不同
 *  - 最后两个节点组成的线段平行
 */
export function isSimilar(path1: PathWithPoint, path2: PathWithPoint) {
  if (path1.length !== path2.length) {
    return false;
  }

  if (path1.length < 2) {
    return true;
  }

  for (let i = 0; i < path1.length - 2; i++) {
    if (!path1[i].isEqual(path2[i])) {
      return false;
    }
  }

  const selfSegment = new Point(path1[path1.length - 1], path1[path1.length - 2]);
  const inputSegment = new Point(path2[path2.length - 1], path2[path2.length - 2]);

  return selfSegment.isParallelTo(inputSegment);
}

/**
 * 终点（起点）指向某点
 *  - 导线节点数量少于等于`1`则忽略
 *  - 导线节点数量等于`2`则会按照线段方向修正
 */
export function endToPoint(input: PathWithPoint, mouse: Point, isEnd = true) {
  const path = copyLine(input);

  if (path.length <= 1) {
    return path;
  }

  const last = isEnd ? path.length - 1 : 0;
  const prev = isEnd ? path.length - 2 : 1;
  const lastVector = new Point(path[prev], path[last]);

  if (path.length === 2) {
    if (lastVector.isHorizontal()) {
      path[last] = Point.from([mouse[0], path[last][1]]);
    }
    else if (lastVector.isVertical()) {
      path[last] = Point.from([path[last][0], mouse[1]]);
    }

    return path;
  }

  if (lastVector.isHorizontal()) {
    path[prev] = Point.from([path[prev][0], mouse[1]]);
  }
  else if (lastVector.isVertical()) {
    path[prev] = Point.from([mouse[0], path[prev][1]]);
  }

  path[last] = Point.from(mouse);

  return path;
}

/**
 * 终点（起点）指向某线段
 *  - 导线节点数量少于`3`则忽略
 *  - 输入线段必定与`input`平行
 */
export function endToLine(
  input: PathWithPoint,
  segment: SegmentWithPoint,
  mouse: Point,
) {
  const path = copyLine(input);

  if (path.length < 3) {
    return path;
  }

  const byMouseMain = new Point(segment[0], segment[1]).isHorizontal() ? 0 : 1;

  path[path.length - 2][byMouseMain] = mouse[byMouseMain];
  path[path.length - 1][byMouseMain] = mouse[byMouseMain];

  return path;
}

/** 导线节点标准化 */
export function standardize(path: PathWithPoint) {
  return path.map((item) => item.round(20));
}

/** 导线坐标整体偏移 */
export function move(path: PathWithPoint, bias: PointLike) {
  return path.map((item) => item.add(bias));
}

/** 查询节点所在导线及引脚 */
export function findLinePinAndIndex(point: Point, lines: LineStructuredData[]) {
  const pins: LineWithPin[] = [];
  let index: LineWithIndex | undefined;

  for (const line of lines) {
    if (line.path[0].isEqual(point)) {
      pins.push({
        data: line,
        pin: 0,
      });
      continue;
    }

    if (line.path[line.path.length - 1].isEqual(point)) {
      pins.push({
        data: line,
        pin: 1,
      });
      continue;
    }

    for (let i = 0; i < line.path.length - 1; i++) {
      const segment = [line.path[i], line.path[i + 1]];

      if (point.isInLine(segment)) {
        index = {
          data: line,
          index: i,
        };

        return index;
      }
    }
  }

  return pins.length > 0 ? pins : undefined;
}

/**
 * 查找距离坐标最近的导线
 *   - 只会查找作为坐标端点的导线
 */
export function findNearestLineByPoint(
  point: Point,
  lines: LineStructuredData[],
) {
  const roundedPoint = point.round(20);
  const crossLines = lines.filter((line) =>
    line.path[0].isEqual(roundedPoint)
    || line.path[line.path.length - 1].isEqual(roundedPoint),
  );

  if (crossLines.length === 0) {
    return;
  }

  // 计算原始坐标到每个导线的最小距离
  let nearestLine: LineStructuredData | undefined;
  let minDistance = Infinity;

  for (const line of crossLines) {
    // 计算点到导线所有线段的最小距离
    let lineMinDistance = Infinity;

    for (let i = 0; i < line.path.length - 1; i++) {
      const segment: SegmentWithPoint = [line.path[i], line.path[i + 1]];
      const distance = point.distanceToSegment(segment);
      lineMinDistance = Math.min(lineMinDistance, distance);
    }

    // 更新最近距离和对应的导线
    if (lineMinDistance < minDistance) {
      minDistance = lineMinDistance;
      nearestLine = line;
    }
  }

  if (!nearestLine) {
    return;
  }

  const getPin = (line: LineStructuredData) => roundedPoint.isEqual(line.path[0]) ? 0 : 1;

  return {
    nearest: {
      data: nearestLine,
      pin: getPin(nearestLine),
    } as LineWithPin,
    rest: crossLines
      .filter((line) => line.id !== nearestLine.id)
      .map((line): LineWithPin => ({
        data: line,
        pin: getPin(line),
      })),
  };
}
