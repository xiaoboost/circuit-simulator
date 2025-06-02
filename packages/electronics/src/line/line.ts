import { Point } from '@circuit/algorithm';
import { LineStoreData, LineStructuredData } from './types';

export { isLine } from '@circuit/shared';

let lineId = 1;

export function transformLineStoreToStateData({ path }: LineStoreData): LineStructuredData {
  return {
    id: `line_${lineId++}`,
    path: path.map(Point.from),
  };
}

export function transformLineStateToStoreData({ path }: LineStructuredData): LineStoreData {
  return {
    path: path.map((item) => item.toData()),
  };
}
