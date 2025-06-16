import { Point, Rect } from '@circuit/algorithm';
import { LineOrPartStructuredData } from '@circuit/types';
import { createServiceKey } from '../../context';

/** 实体区域 */
export interface IEntityRegion {
  id: string;
  rects: Rect[];
}

/**
 * 碰撞检测服务
 *
 * @description 该服务用于获取碰撞检测配置
 * @example
 * ```ts
 * const collisionService = useService(COLLISION_SERVICE);
 * ```
 */
export const COLLISION_SERVICE =
  createServiceKey<ICollisionService>('CollisionService');

export interface ICollisionService {
  // ===== 实体管理 =====
  /**
   * 添加实体到碰撞系统
   *
   * @description 如果有了那就更新
   */
  setEntity(entity: LineOrPartStructuredData): void;

  /**
   * 移除实体
   */
  removeEntity(id: string): void;

  /**
   * 清空所有实体
   */
  clearAll(): void;

  // ===== 碰撞检测 =====
  /**
   * 检查点是否在任何实体内部
   * @param point 要检查的点坐标
   * @returns 包含该点的实体ID列表
   */
  pointInEntities(point: Point): string[];

  /**
   * 检查矩形区域是否与任何实体碰撞
   */
  rectCollides(rect: Rect): string[];

  /**
   * 检查新实体位置是否可用
   * @param entity 要检查的实体
   * @returns 是否无碰撞
   */
  isPositionAvailable(device: LineOrPartStructuredData): boolean;

  /**
   * 查找最近的可用位置（器件专用）
   * @param device 器件实体
   * @param maxOffset 最大偏移量（像素）
   * @returns 最近可用坐标
   */
  findNearestAvailablePosition(
    device: LineOrPartStructuredData,
    maxOffset?: number,
  ): Point | null;

  // ===== 查询接口 =====
  /**
   * 获取实体边界框（所有矩形的外包矩形）
   * @param id 实体ID
   * @returns 边界框或`undefined`
   */
  getEntityBoundingBox(id: string): Rect | undefined;

  /**
   * 获取实体的碰撞矩形数组
   * @param id 实体ID
   * @returns 矩形数组
   */
  getEntityCollisionRects(id: string): Rect[];

  /**
   * 获取完全在指定矩形内的所有实体
   * @param rect 指定的矩形区域
   * @returns 完全在矩形内的实体ID列表
   */
  getEntitiesInRect(rect: Rect): string[];

  // ===== 特殊方法 =====
  /**
   * 可视化碰撞区域（调试用）
   * @returns `SVG`字符串表示所有碰撞矩形
   */
  debugVisualize(): void;
}
