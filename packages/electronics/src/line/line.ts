import { Point } from '@circuit/algorithm';
import { LineStoreData, LineStructuredData } from '@circuit/types';

let lineId = 1;

export function isLineId(id: string) {
  return /^_\$[lL]ine_\d+$/.test(id);
}

function createLineId() {
  return `_$line_${lineId++}`;
}

export function transformLineStoreToStructureData({ path }: LineStoreData): LineStructuredData {
  return {
    id: createLineId(),
    path: path.map(Point.from),
  };
}

export function transformLineStructureToStoreData({ path }: LineStructuredData): LineStoreData {
  return {
    path: path.map((item) => item.toData()),
  };
}

export function createLine(start: Point): LineStructuredData {
  return {
    id: createLineId(),
    path: [start],
  };
}
