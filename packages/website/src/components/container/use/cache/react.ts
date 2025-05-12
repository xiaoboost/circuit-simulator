import { useEffect, useState } from 'react';
import { StateController } from '../../../../libraries';
import { StateData } from '../../../../types';
import { readFromCache } from './storage';

/** 状态初始化 */
export function useStateInit() {
  const [controller, setController] = useState<StateController<StateData>>();

  useEffect(() => {
    readFromCache().then((data) => {
      setController(new StateController(data));
    });
  }, []);

  return controller;
}
