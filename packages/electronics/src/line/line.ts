import { Point, type PathWithPoint, type PointLike } from '@circuit/algorithm';
import { type LineStoreData, type LineStructuredData } from '@circuit/types';
import { nanoid } from 'nanoid';

export function isLineId(id: string) {
  return /^_\$[lL]ine_\d+$/.test(id);
}

function createLineId() {
  return `_$line_${nanoid()}`;
}

/** 复制导线路径 */
export function copyLine(line: PathWithPoint | PointLike[]): PathWithPoint {
  return line.map(Point.from);
}

export function transformLineStoreToStructureData({ path }: LineStoreData): LineStructuredData {
  return {
    id: createLineId(),
    path: copyLine(path),
  };
}

export function transformLineStructureToStoreData({ path }: LineStructuredData): LineStoreData {
  return {
    path: path.map((item) => item.toData()),
  };
}

/**
 * 从路径创建导线
 *
 * @description 导线路径将会整体复制
 */
export function createLineByPath(path: PathWithPoint): LineStructuredData {
  return {
    id: createLineId(),
    path: copyLine(path),
  };
}

export function createLine(start: Point): LineStructuredData {
  return {
    id: createLineId(),
    path: [Point.from(start)],
  };
}

/** 获取当前线段的方向 */
export function getIndexVector(path: PathWithPoint, index: number) {
  return new Point(path[index], path[index + 1]);
}
