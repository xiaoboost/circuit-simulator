import { PluginMetaInfos, RootScope } from './context';
import type { ServiceTypeWithKey, PluginInstaller } from './types';

/** 创建服务键 */
export function createServiceKey<T>(name: string) {
  return Symbol(name) as unknown as ServiceTypeWithKey<T>;
}

/** 创建作用域插件定义 */
export function createPluginDefinitionWithScope(scope: symbol) {
  return function definePluginWithScope(installer: PluginInstaller) {
    definePlugin(scope, installer);
  };
}

/** 在作用域注册插件 */
function definePlugin(scope: symbol, installer: PluginInstaller) {
  if (!PluginMetaInfos.has(installer)) {
    PluginMetaInfos.set(installer, {
      scope,
      installer,
    });
  }
}

/** 全局作用域注册插件 */
export const defineGlobalPlugin = createPluginDefinitionWithScope(RootScope);
