import { createServiceKey } from '@circuit/inject';
import type { Watcher } from '@circuit/reactive';

/**
 * 鼠标指针服务键
 *
 * @description 该服务用于获取鼠标指针变换功能
 * @example
 * ```ts
 * const cursorService = useService(ICursorService);
 * ```
 */
export const ICursorService
  = createServiceKey<ICursorService>('CursorService');

/** 指针类别 */
export enum CursorKind {
  /** 默认指针 */
  Default,
  /* 禁止操作 */
  NotAllowed,
  /* 十字准星 */
  Crosshair,
  /* 左右调整 */
  ResizeEW,
  /* 上下调整 */
  ResizeNS,
  /** 可抓取 */
  Drag,
  /** 抓取状态（拖拽中） */
  Dragging,
  /** 多选框 */
  SelectBox,
  /** 绘制导线 */
  DrawLine,
}

/** 指针服务 */
export interface ICursorService {
  /** 当前指针 */
  readonly value: Watcher<CursorKind>;
  /** 指针类别枚举 */
  readonly kind: typeof CursorKind;
  /** 设置指针类别 */
  set(kind: CursorKind): void;
  /** 恢复默认指针 */
  clear(): void;
}
