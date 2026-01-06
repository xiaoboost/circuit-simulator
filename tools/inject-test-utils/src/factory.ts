import { createRegisterPlugin, type ResolveRegisterFn } from './register';
import { createGetService, createGetServiceAfterMounted } from './service';
import { createGetHooks, createGetHooksAfterMounted } from './hooks';

/** 测试工具配置 */
export interface TestUtilsConfig {
  /** 作用域 */
  scope: symbol;
  /** 插件路径解析函数 */
  resolveRegister: ResolveRegisterFn;
}

/** 测试工具接口 */
export interface TestUtils {
  /** 注册插件 */
  registerPlugin: ReturnType<typeof createRegisterPlugin>;
  /** 获取服务 */
  getService: ReturnType<typeof createGetService>;
  /** 获取服务（等待生命周期完成） */
  getServiceAfterMounted: ReturnType<typeof createGetServiceAfterMounted>;
  /** 获取钩子 */
  getHooks: ReturnType<typeof createGetHooks>;
  /** 获取钩子（等待生命周期完成） */
  getHooksAfterMounted: ReturnType<typeof createGetHooksAfterMounted>;
}

/**
 * 创建测试工具实例
 *
 * @param config 配置
 * @returns 测试工具实例
 */
export function createTestUtils(config: TestUtilsConfig): TestUtils {
  return {
    registerPlugin: createRegisterPlugin(config.resolveRegister),
    getService: createGetService(config.scope),
    getServiceAfterMounted: createGetServiceAfterMounted(config.scope),
    getHooks: createGetHooks(config.scope),
    getHooksAfterMounted: createGetHooksAfterMounted(config.scope),
  };
}

/**
 * 创建特定作用域的测试工具（便捷方法）
 *
 * @param config 配置
 * @returns 测试工具实例
 */
export function createScopeTestUtils(config: TestUtilsConfig): TestUtils {
  return createTestUtils(config);
}

