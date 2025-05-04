import type { HookType, ServiceType } from '../types';

/**
 * 服务注册键
 *
 * @description 因为要用于推倒类型，所以这里的类型和实际类型并不相符
 * @internal
 */
export interface ServiceTypeWithKey<T> {
  key: symbol;
  service: T;
}

/** 卸载插件回调 */
export type PluginUninstaller = () => void | Promise<void>;

/** 注册插件回调 */
export type PluginInstaller = (context: IPluginInstallerContext) => PluginUninstaller | void;

/** 插件注册上下文 */
export interface IPluginInstallerContext {
  /** 获取当前服务 */
  getService<T extends ServiceType>(key: ServiceTypeWithKey<T>): T;
  /** 获取当前钩子 */
  getHook<T extends HookType>(key: ServiceTypeWithKey<T>): T[];
  /** 注册服务 */
  registerService<T extends ServiceType>(key: ServiceTypeWithKey<T>, service: T): void;
  /** 注册钩子 */
  registerHook<T extends HookType>(key: ServiceTypeWithKey<T>, hook: T): void;
}

/** 上下文储存 */
export interface IPainterContext {
  /** 服务储存表 */
  ServiceMap: Map<ServiceTypeWithKey<any>, ServiceType>;
  /** 钩子储存表 */
  HookMap: Map<ServiceTypeWithKey<any>, HookType[]>;
  /** 插件卸载器储存 */
  PluginUninstallers: PluginUninstaller[];
}
