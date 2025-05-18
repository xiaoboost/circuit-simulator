import {
  PartStoreData,
  LineStoreData,
  transformPartStoreToStateData,
  transformLineStoreToStateData,
} from '@circuit/electronics';
import { StateData } from '../../../../types';
import { storage, Columns } from './constant';

import * as Example from './example';

/** 从数据库中读取数据 */
export async function readFromCache() {
  await storage.ready();

  const cacheData = await Promise.all(
    Columns.map((column) => storage.getItem(column)));

  // const parts = ((cacheData[1] ?? []) as PartStoreData[]).map(transformPartStoreToStateData);
  // const lines = ((cacheData[1] ?? []) as LineStoreData[]).map(transformLineStoreToStateData);

  // FIXME:
  const parts = ((Example.parts ?? []) as PartStoreData[]).map(transformPartStoreToStateData);
  const lines = ((Example.lines ?? []) as LineStoreData[]).map(transformLineStoreToStateData);

  const data: StateData = {
    version: (cacheData[0] ?? '1.0.0') as string,
    parts,
    lines,
  };

  return data;
}
