import { Point, Rect } from '@circuit/algorithm';
import { LineOrPartStructuredData } from '@circuit/types';
import { createServiceKey } from '../../context';
import { Entity } from '../types';

/** 实体区域 */
export interface IEntityRegion {
  /**
   * 实体编号
   *
   * @description 唯一性
   */
  id: string;
  /** 关联实体 */
  entity: Entity;
  /** 区域尺寸 */
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
   * @description 如果有了那就更新
   */
  setEntity(entity: LineOrPartStructuredData): void;

  /**
   * 移除实体
   * @param id 实体ID
   */
  removeEntity(id: string): void;

  /**
   * 清空所有实体
   */
  clearAll(): void;

  // ===== 碰撞检测 =====
  /**
   * 检查点是否与任何实体碰撞
   * @param point 要检查的点坐标
   * @returns 包含该点的实体ID列表
   */
  pointInEntities(point: Point): Entity[];

  /**
   * 检查矩形是否与任何实体碰撞
   * @param rect 要检查的矩形
   * @returns 包含该点的实体ID列表
   */
  rectInEntities(rect: Rect): Entity[];

  /**
   * 检查实体是否与任何已有实体碰撞
   * @param entity 要检查的实体
   * @returns 是否无碰撞
   */
  isEntityCollision(entity: LineOrPartStructuredData): boolean;

  /**
   * 查找最近的无碰撞位置
   * @param device 器件实体
   * @param maxOffset 最大偏移量（像素）
   * @returns 返回偏移量
   */
  findNearestNotCollisionPosition(
    device: LineOrPartStructuredData,
    maxOffset?: number,
  ): Point | null;

  // ===== 查询接口 =====
  /**
   * 获取实体边界框（所有矩形的外包矩形）
   * @param id 实体ID
   * @returns 边界框或`undefined`
   */
  getEntityBoundingBox(...ids: string[]): Rect | undefined;

  /**
   * 获取实体区域
   * @param id 实体ID
   * @returns 实体区域
   */
  getEntityRegion(id: string): IEntityRegion[];

  /**
   * 获取实体碰撞矩形
   * @param id 实体ID
   * @returns 矩形矩形
   */
  getEntityRects(id: string): Rect[];

  /**
   * 获取所有实体的碰撞矩形
   * @returns 矩形数组
   */
  getAllEntityRects(): Rect[];

  /**
   * 获取完全在指定矩形内的所有元件
   * @param rect 指定的矩形区域
   * @returns 完全在矩形内的实体对应元件编号列表
   */
  getElectronicsInRect(rect: Rect): Set<string>;
}
