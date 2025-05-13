import { PointLike } from '@circuit/algorithm';
import { PartStructuredData, LineStructuredData } from '@circuit/electronics';
import { MarkMap } from '@circuit/map';
import { createServiceKey } from '../../context';

/**
 * 图纸服务键
 *
 * @description 图纸服务，该服务主要是提供图纸相关服务，比如元件连接关系等。
 * @example
 * ```ts
 * const mapService = usePainterService(MAP_SERVICE_KEY);
 * ```
 */
export const MAP_SERVICE_KEY =
  createServiceKey<IMapService>('Map');

/** 引脚连接 */
export interface IPinConnection {
  /** 元件编号 */
  id: string;
  /** 引脚号 */
  pin: number;
}

/** 图纸服务 */
export interface IMapService {
  /** 标记服务 */
  markService: MarkMap;
  /** 设置器件标记 */
  setPartMark(data: PartStructuredData): void;
  /** 设置导线标记 */
  setLineMark(data: LineStructuredData): void;
  /** 删除器件标记 */
  deletePartMark(data: PartStructuredData): void;
  /** 删除导线标记 */
  deleteLineMark(data: LineStructuredData): void;
  /** 获取当前节点的所有连接 */
  getPinConnectionByPosition(position: PointLike): IPinConnection[];
  /** 获取当前引脚的连接 */
  getPinConnectionByPin(id: string, pin: number): IPinConnection[];
}
