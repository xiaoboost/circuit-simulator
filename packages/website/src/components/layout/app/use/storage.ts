import {
  transformPartStoreToStructureData as transformPart,
  transformLineStoreToStructureData as transformLine,
  transformPartStructureToStoreData as transformPartStore,
  transformLineStructureToStoreData as transformLineStore,
  PartStructuredData,
  LineStructuredData,
} from '@circuit/electronics';
import { PainterProps } from '@circuit/painter';
import { message } from 'antd';
import { useEffect, useState, useRef, useMemo } from 'react';
import { StateController, CommitData, EditProducer, CacheController } from '../../../../libraries';
import { StructuredData } from '../../../../types';

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

function getInitData(cache: CacheController): Promise<StructuredData> {
  const data: StructuredData = {
    version: '1.0.0',
    parts: [],
    lines: [],
  };

  return Promise.all(
    Columns.map(async (v) => {
      const val = await cache.get(v.key);
      (data as any)[v.key] = v.transform(val);
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
      setStorage(cache.current!, data);
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

    getInitData(cache.current).then((data) => {
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

  return [Boolean(state), data] as const;
}
