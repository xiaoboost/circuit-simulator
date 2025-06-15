import {
  transformLineStoreToStructureData as transformLine,
  transformLineStructureToStoreData as transformLineStore,
  transformPartStoreToStructureData as transformPart,
  transformPartStructureToStoreData as transformPartStore,
} from '@circuit/electronics';
import Examples from '@circuit/examples';
import { STORAGE_SERVICE, IStorageService, STATE_CORE_SERVICE } from '@circuit/shared';
import { PartStructuredData, LineStructuredData, StructuredData, StoreData } from '@circuit/types';
import { isString } from '@xiao-ai/utils';
import { parse } from 'qs';
import { definePlugin, LIFE_CYCLE_HOOK } from '../../../context';

/** 数据列 */
const Columns = [
  {
    key: 'version',
    transform: (data: unknown) => data ? String(data) : '1.0.0',
    reverse: (data: string) => data,
  },
  {
    key: 'parts',
    transform: (data: unknown) => Array.isArray(data) ? data.map(transformPart) : [],
    reverse: (data: PartStructuredData[]) => data.map(transformPartStore),
  },
  {
    key: 'lines',
    transform: (data: unknown) => Array.isArray(data) ? data.map(transformLine) : [],
    reverse: (data: LineStructuredData[]) => data.map(transformLineStore),
  },
];

function transformStoreData(input: unknown): StructuredData {
  const data: StructuredData = {
    parts: [],
    lines: [],
  };

  for (const column of Columns) {
    const val = (input as any)[column.key];
    (data as any)[column.key] = column.transform(val);
  }

  return data;
}

function getStoreByExample(): Promise<StoreData | undefined> {
  const { example } = parse(location.search.slice(1));

  if (example && isString(example) && example in Examples) {
    const exampleData = Examples.find((v) => v.key === example);
    if (exampleData) {
      return exampleData.data();
    }
  }

  return Promise.resolve(undefined);
}

function getStoreByCache(cache: IStorageService): Promise<StoreData> {
  const data: StoreData = {
    version: '1.0.0',
    parts: [],
    lines: [],
  };

  return Promise.all(
    Columns.map(async (v) => {
      (data as any)[v.key] = await cache.get(v.key);
    }),
  ).then(() => data);
}

definePlugin(({ registerHook, getService }) => {
  registerHook(LIFE_CYCLE_HOOK, {
    afterPluginInit() {
      const storage = getService(STORAGE_SERVICE);
      const stateCore = getService(STATE_CORE_SERVICE);

      getStoreByExample()
        .then((data) => {
          return data ? Promise.resolve(data) : getStoreByCache(storage);
        })
        .then((data) => transformStoreData(data))
        .then((data) => {
          // 缓存为空，则不加载
          if (data.parts.length === 0 && data.lines.length === 0) {
            return;
          }

          stateCore.commit({
            name: '图纸初始化',
            description: '初始化加载图纸数据',
            patch(state) {
              state.parts.push(...data.parts);
              state.lines.push(...data.lines);
            },
          });
        });
    },
  });
});
