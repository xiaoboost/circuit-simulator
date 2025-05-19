import { useUnmount } from 'react-use';
import { IPainterContext } from '../../../context/types';

/** 画布组件卸载 */
export function usePainterUnmount(context: IPainterContext) {
  useUnmount(() => {
    context.PluginUninstallers.forEach((cb) => cb());
    context.PluginUninstallers.length = 0;
    context.HookMap.clear();
    context.ServiceMap.clear();
  });
}
