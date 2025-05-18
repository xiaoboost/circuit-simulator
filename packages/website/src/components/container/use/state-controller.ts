import { CommitData } from '@circuit/painter';
import { useEffect, useState, useCallback, useRef } from 'react';
import { StateController, SubscribeEventName } from '../../../libraries';
import { StateData } from '../../../types';

export function useStateController(data: StateData | undefined) {
  const controller = useRef<StateController<StateData>>(null);
  const [state, setState] = useState<StateData | undefined>();
  const commit = useCallback((data: CommitData) => {
    if (controller.current) {
      controller.current.commit(data.name, data.description, data.patch);
    }
  }, []);

  // 只在初始化时运行一次
  useEffect(() => {
    if (data && !controller.current) {
      controller.current = new StateController(data);
      setState(data);
    }
  }, [data]);

  useEffect(() => {
    if (!controller.current) {
      return;
    }

    return controller.current.observe(SubscribeEventName.Change, setState);
  }, [controller.current]);

  return [state, commit] as const;
}
