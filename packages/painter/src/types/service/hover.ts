import { createServiceKey, Watcher } from '../../context';

/**
 * 鼠标悬停服务键
 *
 * @description 该服务用于获取鼠标悬停功能
 * @example
 * ```ts
 * const hoverService = useService(HOVER_SERVICE);
 * ```
 */
export const HOVER_SERVICE =
  createServiceKey<IHoverService>('HoverService');

export enum HoverKind {
  Part,
  PartPin,
  Line,
  LinePin,
}

export interface HoverPartStatus {
  kind: HoverKind.Part;
  /** 元件编号 */
  id: string;
}

export interface HoverPartPinStatus {
  kind: HoverKind.PartPin;
  /** 元件编号 */
  id: string;
  /** 元件引脚 */
  pin: number;
}

export interface HoverLineStatus {
  kind: HoverKind.Line;
  /** 导线编号 */
  id: string;
  /** 导线线段索引 */
  index: number;
}

export interface HoverLinePinStatus {
  kind: HoverKind.LinePin;
  /** 导线编号 */
  id: string;
  /**
   * 元件引脚
   *
   * @description `0`表示起点，`1`表示终点
   */
  pin: 0 | 1;
}

export type HoverStatus =
  | HoverPartStatus
  | HoverPartPinStatus
  | HoverLineStatus
  | HoverLinePinStatus;

/** 鼠标悬停服务 */
export interface IHoverService {
  /** 当前悬停状态 */
  status: Watcher<HoverStatus | undefined>;
}
