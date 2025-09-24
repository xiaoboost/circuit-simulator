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

/** 插件原始信息 */
export interface IPluginMeta {
  /** 插件作用域 */
  scope: symbol;
  /** 插件安装器 */
  installer: PluginInstaller;
}

/** 容器注册方法 */
export interface IPluginScopeRegister {
  /** 注册服务 */
  registerService<T>(key: ServiceTypeWithKey<T>, service: T): void;
  /** 注册钩子 */
  registerHook<T>(key: ServiceTypeWithKey<T>, hook: T): void;
}

/** 插件注册上下文 */
export interface IPluginInstallerContext extends IPluginScopeRegister {
  /** 获取当前服务 */
  getService<T>(key: ServiceTypeWithKey<T>): T;
  /** 获取当前钩子 */
  getHook<T>(key: ServiceTypeWithKey<T>): T[];
  /** 获取测试时配置 */
  getTestConfig<T = any>(key: string): T;

  /** 根节点上下文 */
  root(): IPluginScopeRegister;
  /**
   * 上级容器上下文
   *
   * @description 如果当前是根节点，则返回`undefined`
   */
  parent(): IPluginScopeRegister | undefined;
}

/** 上下文储存 */
export interface IInjectContext {
  /** 服务储存表 */
  ServiceMap: Map<ServiceTypeWithKey<any>, any>;
  /** 钩子储存表 */
  HookMap: Map<ServiceTypeWithKey<any>, any[]>;
  /** 插件卸载器储存 */
  PluginUninstallers: PluginUninstaller[];
}

/** 作用域 */
export interface IScopeContainer {
  /** 作用域标识 */
  scope: symbol;
  /** 上级作用域 */
  parent: IScopeContainer | null;
  /** 上下文 */
  context: IInjectContext;
  /** 子作用域 */
  children: IScopeContainer[];
}

/** 作用域管理器 */
export type IScopeManager = Map<symbol, IScopeContainer>;
