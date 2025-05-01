import { createContext } from 'react';
import type { IPainterContext, PluginInstaller } from './types';

/** 插件定义储存 */
export const PluginInstallers: PluginInstaller[] = [];
/** 画布上下文标记 */
export const PainterContext = createContext<IPainterContext>({
  ServiceMap: new Map(),
  HookMap: new Map(),
  PluginUninstallers: [],
});
