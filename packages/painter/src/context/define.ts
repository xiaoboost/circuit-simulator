import { PluginInstallers } from './context';
import type { ServiceTypeWithKey, PluginInstaller } from './types';

export { Watcher } from '@xiao-ai/utils';
export { useWatcher } from '@xiao-ai/utils/use';

/** 创建服务键 */
export function createServiceKey<T>(name: string) {
  return Symbol(name) as unknown as ServiceTypeWithKey<T>;
}

/** 注册插件 */
export function definePlugin(installer: PluginInstaller) {
  if (PluginInstallers.includes(installer)) {
    PluginInstallers.push(installer);
  }
}
