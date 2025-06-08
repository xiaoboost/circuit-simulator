import {
  transformPartStoreToStructureData as transformPart,
  transformLineStoreToStructureData as transformLine,
  transformPartStructureToStoreData as transformPartStore,
  transformLineStructureToStoreData as transformLineStore,
  PartStructuredData,
  LineStructuredData,
} from '@circuit/electronics';
import { PainterProps } from '@circuit/painter';
import { isString } from '@xiao-ai/utils';
import { message } from 'antd';
import { parse } from 'qs';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { StateController, CommitData, EditProducer, CacheController } from '../../../../libraries';
import { StoreData, StructuredData } from '../../../../types';

/** 数据表名称 */
const TableName = 'storage';
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
/** 示例数据 */
const Examples = {
  'bridge-rectifier': {
    name: '桥式整流',
    key: 'bridge-rectifier',
    data: () => import('@circuit/examples/bridge-rectifier').then((m) => m.data),
  },
};

function transformStoreData(input: unknown): StructuredData {
  const data: StructuredData = {
    version: '1.0.0',
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
    return Examples[example as keyof typeof Examples].data() as any;
  }

  return Promise.resolve(undefined);
}

function getStoreByCache(cache: CacheController): Promise<StoreData> {
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

function setStorage(cache: CacheController, data: StructuredData): Promise<void> {
  return Promise.all(
    Columns.map((v) => {
      return cache.set(v.key, v.reverse((data as any)[v.key]));
    }),
  ).then(() => void 0);
}

export function useStorage() {
  const stateController = useRef<StateController<StructuredData>>(null);
  const cache = useRef<CacheController>(null);
  const [state, setState] = useState<StructuredData | undefined>();
  const [isReadonly, setIsReadonly] = useState<boolean>(false);

  // 监听实例的回调
  const [onCommit, onUndo, onRedo, onDraft, onDropDraft] = useMemo(() => ([
    (data: CommitData<any>) => stateController.current?.commit(data),
    () => stateController.current?.undo(),
    () => stateController.current?.redo(),
    (data: EditProducer<any>) => stateController.current?.draft(data),
    () => stateController.current?.dropDraft(),
  ]), [stateController.current]);

  useEffect(() => {
    if (!stateController.current || !cache.current) {
      return;
    }

    const { current } = stateController;
    const { SubscribeEventName: Name } = StateController;

    const unObserve1 = current.observe(Name.Change, (data) => {
      setState(data);
    });
    const unObserve2 = current.observe(Name.Commit, (data) => {
      // 只读模式下不写入缓存
      if (isReadonly) {
        setStorage(cache.current!, data);
      }
    });
    const unObserve3 = current.observe(Name.Undo, (msg: string) => {
      message.info({
        type: 'success',
        content: `已撤销: ${msg}`,
      });
    });
    const unObserve4 = current.observe(Name.Redo, (msg: string) => {
      message.open({
        type: 'success',
        content: `已重做: ${msg}`,
      });
    });

    return () => {
      unObserve1();
      unObserve2();
      unObserve3();
      unObserve4();
    };
  }, [stateController.current]);

  useEffect(() => {
    cache.current = new CacheController(TableName);

    getStoreByExample()
      .then((data) => {
        if (data) {
          setIsReadonly(true);
          return Promise.resolve(data);
        }
        else {
          return getStoreByCache(cache.current!);
        }
      })
      .then((data) => {
        return transformStoreData(data);
      })
      .then((data) => {
        stateController.current = new StateController(data);
        setState(data);
      });
  }, []);

  const data: Readonly<Omit<PainterProps, 'onReady'>> = {
    onCommit,
    onUndo,
    onRedo,
    onDraft,
    onDropDraft,
    lines: state?.lines ?? [],
    parts: state?.parts ?? [],
    canUndo: stateController.current?.canUndo ?? false,
    canRedo: stateController.current?.canRedo ?? false,
  };
  // 强制写缓存
  const writeCache = useCallback(() => {
    if (cache.current && state) {
      setStorage(cache.current, state);
    }
  }, [cache.current, state]);

  return {
    isReadonly,
    isDataReady: Boolean(state),
    data,
    writeCache,
  };
}
