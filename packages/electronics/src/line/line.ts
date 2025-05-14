import { ElectronicKind } from '../types';
import { LineStoreData, LineStructuredData } from './types';

export { isLine } from '@circuit/shared';

let lineId = 1;

export function transformLineStoreToStateData(data: LineStoreData): LineStructuredData {
  return {
    ...data,
    id: `line_${lineId++}`,
    kind: ElectronicKind.Line,
  };
}

export function transformLineStateToStoreData(data: LineStructuredData): LineStoreData {
  const { path } = data;

  return {
    path,
  };
}
