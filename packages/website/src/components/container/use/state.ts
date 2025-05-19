import { PainterProps } from '@circuit/painter';
import { useEffect, useState, useRef, useMemo } from 'react';
import { StateController, CommitData } from '../../../libraries';
import { StateData } from '../../../types';

export function usePainterState(data?: StateData): Readonly<Omit<PainterProps, 'onReady'>> {
  const controller = useRef<StateController<StateData>>(null);
  const [state, setState] = useState<StateData | undefined>();

  // 三个方法只需要监听实例
  const [commit, undo, redo] = useMemo(() => ([
    (data: CommitData<any>) => setState(controller.current?.commit(data)),
    () => controller.current?.undo(),
    () => controller.current?.redo(),
  ]), [controller.current]);

  useEffect(() => {
    if (data) {
      controller.current = new StateController(data);
      setState(data);
    }
  }, [data]);

  return {
    commit,
    undo,
    redo,
    lines: state?.lines ?? [],
    parts: state?.parts ?? [],
    canUndo: controller.current?.canUndo ?? false,
    canRedo: controller.current?.canRedo ?? false,
  };
}
