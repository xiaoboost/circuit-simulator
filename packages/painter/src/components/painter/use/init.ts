import { LIFE_CYCLE_HOOK } from '@circuit/shared';
import { useEffect } from 'react';
import { useHook } from '../../../context';

export function usePainterInit() {
  const cycle = useHook(LIFE_CYCLE_HOOK);

  // 运行到这里说明画布开始渲染，可以运行初始化钩子
  useEffect(() => {
    for (const hook of cycle) {
      hook.afterPainterMounted?.();
    }

    return () => {
      for (const hook of cycle) {
        hook.beforePainterUnmount?.();
      }
    };
  }, []);

  return null;
}
