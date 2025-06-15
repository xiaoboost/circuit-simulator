import { createContext } from 'react';
import type { IPluginMeta, PluginInstaller, IScopeManager } from './types';

/** 根作用域 */
export const RootScope = Symbol('RootScope');
/** 插件定义储存 */
export const PluginMetaInfos = new Map<PluginInstaller, IPluginMeta>();
/** 上下文标记 */
export const InjectContext = createContext<IScopeManager>(new Map());
