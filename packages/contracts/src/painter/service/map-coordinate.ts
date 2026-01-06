import type { Point, Rect, Size } from '@circuit/algorithm';
import { createServiceKey } from '@circuit/inject';
import type { Watcher } from '@circuit/reactive';

/**
 * 图纸坐标服务键
 *
 * @description 该服务用于获取图纸坐标的转换和计算功能
 * @example
 * ```ts
 * const mapCoordinateService = useService(IMapCoordinateService);
 * ```
 */
export const IMapCoordinateService
  = createServiceKey<IMapCoordinateService>('MapCoordinateService');

/** 图纸坐标服务 */
export interface IMapCoordinateService {
  // ========== 状态 ==========
  /** 图纸缩放比例 */
  readonly scale: Watcher<number>;
  /** 图纸位置 */
  readonly position: Watcher<Point>;

  // ========== 常量 ==========
  /** 图纸缩放比例最小值 */
  readonly ScaleMin: number;
  /** 图纸缩放比例最大值 */
  readonly ScaleMax: number;
  /** 图纸缩放比例步长 */
  readonly ScaleStep: number;

  // ========== 核心方法 ==========
  /** 设置缩放比例 */
  setScale(scale: number): void;
  /** 将输入缩放比例裁剪到允许范围 */
  clampScale(scale: number): number;
  /**
   * 放大图纸
   *
   * @description 缩放比提高 5%
   */
  zoomIn(): void;
  /**
   * 缩小图纸
   *
   * @description 缩放比降低 5%
   */
  zoomOut(): void;
  /** 设置图纸位置 */
  setPosition(position: Point): void;

  // ========== 坐标转换 ==========
  /** 将屏幕坐标转换为视图坐标 */
  screenToViewPosition(position: Point): Point;
  /** 将屏幕坐标转换为图纸坐标 */
  screenToMapPosition(position: Point): Point;
  /** 将视图坐标转换为图纸坐标 */
  viewToMapPosition(position: Point): Point;
  /** 将图纸坐标转换为视图坐标 */
  mapToViewPosition(position: Point): Point;
  /** 将图纸坐标转换为屏幕坐标 */
  mapToScreenPosition(position: Point): Point;
  /** 将视图坐标转换为屏幕坐标 */
  viewToScreenPosition(position: Point): Point;

  // ========== 矩形转换 ==========
  screenToViewRect(rect: Rect): Rect;
  /** 将屏幕坐标转换为图纸坐标 */
  screenToMapRect(rect: Rect): Rect;
  /** 将视图坐标转换为图纸坐标 */
  viewToMapRect(rect: Rect): Rect;
  /** 将图纸坐标转换为视图坐标 */
  mapToViewRect(rect: Rect): Rect;
  /** 将图纸坐标转换为屏幕坐标 */
  mapToScreenRect(rect: Rect): Rect;
  /** 将视图坐标转换为屏幕坐标 */
  viewToScreenRect(rect: Rect): Rect;

  // ========== 视口方法 ==========
  /** 获取当前视口再画布中的矩形 */
  getCurrentViewportRect(): Rect;
  /** 获取当前视口尺寸 */
  getCurrentViewportSize(): Size;
}
