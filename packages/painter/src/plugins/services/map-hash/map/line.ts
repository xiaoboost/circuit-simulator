import { Point, PathWithPoint } from '@circuit/algorithm';
import { LineStructuredData } from '@circuit/types';
import { MarkMap, MarkKind, LineAndPointMark } from '../../../../types';
import {
  isLinePoint,
  isLineCross,
  isFullCross,
  isPartPin,
  isPartPinLine,
  isLine,
  isLineCover,
  addLine,
  deleteLine,
  addConnect,
  deleteConnect,
  isLineAndPoint,
} from '../mark';
import { get, remove, set } from './map';

function getLinePoints(path: PathWithPoint) {
  if (path.length === 0) {
    throw new Error('导线必须至少是个线段');
  }

  const result: Point[] = [];

  for (let i = 1; i < path.length; i++) {
    const start = Point.from(path[i - 1]);
    const end = Point.from(path[i]);
    const vector = end.add(start, -1).sign(20);

    let current = start;

    while (!current.isEqual(end)) {
      result.push(current);
      current = current.add(vector);
    }
  }

  result.push(Point.from(path[path.length - 1]));

  return result;
}

/** 设置导线图纸数据 */
export function setLineMark(data: LineStructuredData, map: MarkMap) {
  const { id: line, path } = data;
  const points = getLinePoints(path);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const lastPoint = points[i - 1];
    const mark = get(map, point);

    // 运行时距离检查
    if (process.env.NODE_ENV === 'development' && lastPoint) {
      if (Math.abs(lastPoint.add(point, -1).product([1, 1])) !== 20) {
        throw new Error('导线节点距离必须是 20');
      }
    }

    // 端点
    if (i === 0 || i === points.length - 1) {
      if (mark) {
        if (isLinePoint(mark)) {
          set(map, addLine(mark, line));
        }
        else if (isLineCross(mark) && !isFullCross(mark)) {
          set(map, addLine(mark, line));
        }
        else if (isPartPin(mark)) {
          set(map, addLine(mark, line));
        }
        else {
          throw new Error('导线端点只能出现在其他导线端点、交错节点、器件引脚处');
        }
      }
      else {
        set(map, {
          kind: MarkKind.LinePoint,
          id: line,
          position: point,
          connection: {},
        });
      }
    }
    else {
      if (mark) {
        if (isLine(mark)) {
          set(map, addLine(mark, line));
        }
        else {
          throw new Error('导线非端点只能途经其余导线的非端点');
        }
      }
      else {
        set(map, {
          kind: MarkKind.Line,
          id: line,
          position: point,
          connection: {},
        });
      }
    }

    if (!lastPoint) {
      continue;
    }

    const lastMark = get<LineAndPointMark>(map, lastPoint)!;
    const currentMark = get<LineAndPointMark>(map, point)!;

    addConnect(lastMark, currentMark.position, line);
    addConnect(currentMark, lastMark.position, line);
  }
}

/** 移除导线图纸数据 */
export function deleteLineMark(data: LineStructuredData, map: MarkMap) {
  const { id: line, path } = data;
  const points = getLinePoints(path);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const lastPoint = points[i - 1];
    const mark = get(map, point);
    const lastMark = lastPoint && get(map, lastPoint);

    // 运行时距离检查
    if (process.env.NODE_ENV === 'development' && lastPoint) {
      if (Math.abs(lastPoint.add(point, -1).product([1, 1])) !== 20) {
        throw new Error('导线节点距离必须是 20');
      }

      if (
        mark
        && (
          (('line' in mark) && mark.line !== line)
          || (('lines' in mark) && !mark.lines.includes(line))
        )
      ) {
        throw new Error('删除节点并非指定导线编号');
      }
    }

    if (point && isLineAndPoint(lastMark)) {
      deleteConnect(lastMark, point);
    }

    if (lastPoint && isLineAndPoint(mark)) {
      deleteConnect(mark, lastPoint);
    }

    if (mark) {
      // 端点
      if (i === 0 || i === points.length - 1) {
        if (isLinePoint(mark)) {
          remove(map, mark.position);
        }
        else if (isLineCross(mark)) {
          set(map, deleteLine(mark, line, map));
        }
        else if (isPartPinLine(mark)) {
          set(map, deleteLine(mark));
        }
        else {
          throw new Error('导线端点只能出现在其他导线端点、交错节点、器件引脚处');
        }
      }
      else {
        if (isLine(mark)) {
          remove(map, mark.position);
        }
        else if (isLineCover(mark)) {
          set(map, deleteLine(mark, line));
        }
        else {
          throw new Error('删除导线时，非端点只可能有导线本身和交叠节点');
        }
      }
    }
  }
}
