import { createServiceKey } from '../../context';

/**
 * 快捷键监听
 *
 * @description 该钩子将用于实现键盘快捷键功能
 * @example
 * ```ts
 * const hotKeyHooks = usePainterHook(HOT_KEY_HOOK);
 * ```
 */
export const HOT_KEY_HOOK = createServiceKey<IHotKey>('HotKey');

/** 快捷键类型 */
export type HotKeyType = string | string[];

/** 快捷键定义 */
export interface IHotKey {
  /** 快捷键 */
  key: HotKeyType;
  /** 快捷操作名称 */
  name: string;
  /** 执行函数 */
  action: (event: KeyboardEvent) => void;
}
