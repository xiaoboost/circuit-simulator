import type { Point, Rect } from '@circuit/algorithm';
import { createServiceKey, type Watcher } from '../../context';

/**
 * 视口镜头服务键
 *
 * @description 该服务用于获取视口镜头的转换和计算功能
 * @example
 * ```ts
 * const viewportService = useService(VIEWPORT_SERVICE);
 * ```
 */
export const VIEWPORT_SERVICE =
  createServiceKey<IViewportService>('ViewportService');

export interface IViewport {
  /** 缩放比例 */
  scale: number;
  /** 当前视口位置 */
  position: Point;
}

/** 视口镜头服务 */
export interface IViewportService {
  /** 是否正在动画 */
  readonly isAnimating: Watcher<boolean>;

  /**
   * 聚焦到指定元件
   * @param {string} id 元件 ID
   * @param {number} [padding=40] 视口边缘到元件的边距，由于图纸有缩放限制，所以这个边距只会在缩放合适的时候生效
   * @param {number} [duration=300] 动画时长
   * @returns {Promise<boolean>} 是否成功聚焦
   */
  focusOnElectronic(id: string, padding?: number, duration?: number): Promise<boolean>;

  /**
   * 聚焦到指定位置
   * @param {Point} position 位置
   * @param {string} [type='center'] 聚焦类型，表示当前坐标在视口中的位置
   * @param {number} [scale=undefined] 缩放比例，不输入表示保持当前缩放比例
   * @param {number} [duration=300] 动画时长
   * @returns {Promise<boolean>} 是否成功聚焦
   */
  focusOnPosition(
    position: Point,
    type?: 'leftTop' | 'leftRight' | 'center',
    scale?: number,
    duration?: number,
  ): Promise<boolean>;

  /**
   * 聚焦到指定矩形（保证矩形完全在视口内）
   * @param {Rect} rect 矩形
   * @param {number} [padding=40] 视口边缘到矩形的边距，由于图纸有缩放限制，所以这个边距只会在缩放合适的时候生效
   * @param {number} [duration=300] 动画时长
   * @returns {Promise<boolean>} 是否成功聚焦
   */
  focusOnRect(rect: Rect, padding?: number, duration?: number): Promise<boolean>;

  /**
   * 适应画布（保证画布内所有内容都在视口内）
   * @param {number} [padding=40] 视口边缘到画布的边距，由于图纸有缩放限制，所以这个边距只会在缩放合适的时候生效
   * @param {number} [duration=300] 动画时长
   * @returns {Promise<boolean>} 是否成功适应
   */
  fitPainter(padding?: number, duration?: number): Promise<boolean>;

  /**
   * 返回上一个视口设置
   * @description 每次设置动画都会在运行前记录视口配置
   * @param {number} [duration=300] 动画时长
   * @returns {Promise<boolean>} 是否成功返回
   */
  goBack(duration?: number): Promise<boolean>;

  /**
   * 检查元件是否在视口内
   * @param {string} id 元件 ID
   * @returns {boolean} 是否在视口内
   */
  isInViewport(id: string): boolean;
}
