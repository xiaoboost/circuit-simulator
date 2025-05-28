import { PainterProps } from '@circuit/painter';
import { message } from 'antd';
import { useEffect, useState, useRef, useMemo } from 'react';
import { StateController, CommitData, EditProducer } from '../../../../libraries';
import { StateData } from '../../../../types';

export function usePainterState(data?: StateData): Readonly<Omit<PainterProps, 'onReady'>> {
  const controller = useRef<StateController<StateData>>(null);
  const [state, setState] = useState<StateData | undefined>();

  // 方法只需要监听实例
  const [commit, undo, redo, draft, dropDraft] = useMemo(() => ([
    (data: CommitData<any>) => controller.current?.commit(data),
    () => controller.current?.undo(),
    () => controller.current?.redo(),
    (data: EditProducer<any>) => controller.current?.draft(data),
    () => controller.current?.dropDraft(),
  ]), [controller.current]);

  useEffect(() => {
    if (data) {
      controller.current = new StateController(data);
      setState(data);
    }
  }, [data]);

  useEffect(() => {
    if (!controller.current) {
      return;
    }

    const { current } = controller;
    const { SubscribeEventName: Name } = StateController;

    const unObserve1 = current.observe(Name.Change, (data) => {
      setState(data);
    });
    const unObserve2 = current.observe(Name.Undo, (msg: string) => {
      message.info({
        type: 'success',
        content: `已撤销: ${msg}`,
      });
    });
    const unObserve3 = current.observe(Name.Redo, (msg: string) => {
      message.open({
        type: 'success',
        content: `已重做: ${msg}`,
      });
    });

    return () => {
      unObserve1();
      unObserve2();
      unObserve3();
    };
  }, [controller.current]);

  return {
    commit,
    undo,
    redo,
    draft,
    dropDraft,
    lines: state?.lines ?? [],
    parts: state?.parts ?? [],
    canUndo: controller.current?.canUndo ?? false,
    canRedo: controller.current?.canRedo ?? false,
  };
}
