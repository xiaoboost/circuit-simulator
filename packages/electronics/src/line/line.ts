import { Point } from '@circuit/algorithm';
import { LineStoreData, LineStructuredData } from './types';

let lineId = 1;

export function isLine(id: string) {
  return /^_\$[lL]ine_\d+$/.test(id);
}

export function transformLineStoreToStateData({ path }: LineStoreData): LineStructuredData {
  return {
    id: `_$line_${lineId++}`,
    path: path.map(Point.from),
  };
}

export function transformLineStateToStoreData({ path }: LineStructuredData): LineStoreData {
  return {
    path: path.map((item) => item.toData()),
  };
}
