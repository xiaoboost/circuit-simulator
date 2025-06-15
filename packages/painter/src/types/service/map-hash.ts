import { PartStructuredData, LineStructuredData } from '@circuit/electronics';
import { MarkMap } from '@circuit/map';
import { createServiceKey } from '../../context';

/**
 * 图纸服务键
 *
 * @description 图纸服务，该服务主要是提供图纸相关服务，比如元件连接关系等。
 * @example
 * ```ts
 * const mapService = useService(MAP_HASH_SERVICE);
 * ```
 */
export const MAP_HASH_SERVICE =
  createServiceKey<IMapService>('Map');

/** 图纸服务 */
export interface IMapService {
  /** 标记服务 */
  readonly markService: MarkMap;
  /** 设置器件标记 */
  setPartMark(data: PartStructuredData): void;
  /** 设置导线标记 */
  setLineMark(data: LineStructuredData): void;
  /** 删除器件标记 */
  deletePartMark(data: PartStructuredData): void;
  /** 删除导线标记 */
  deleteLineMark(data: LineStructuredData): void;
}
