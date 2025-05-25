import { LineStoreData, LineStructuredData } from './types';

export { isLine } from '@circuit/shared';

let lineId = 1;

export function transformLineStoreToStateData(data: LineStoreData): LineStructuredData {
  return {
    ...data,
    id: `line_${lineId++}`,
  };
}

export function transformLineStateToStoreData(data: LineStructuredData): LineStoreData {
  const { path } = data;

  return {
    path,
  };
}
