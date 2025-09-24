import { createContext } from 'react';
import type { IPluginMeta, PluginInstaller, IScopeManager } from './types';

/** 根作用域 */
export const RootScope = Symbol('RootScope');
/** 作用域从属关系储存 */
export const ScopeMetaInfos = new Map<symbol, symbol[]>();
/** 插件元信息储存 */
export const PluginMetaInfos = new Map<PluginInstaller, IPluginMeta>();
/** 上下文标记 */
export const InjectContext = createContext<IScopeManager>(new Map());
/** 测试用的全局命名空间 */
export const TestGlobalNamespace = '__TEST_CONFIG__';
