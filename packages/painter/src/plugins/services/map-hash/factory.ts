import { isPart } from '@circuit/electronics';
import {
  IMapHashService,
  MarkMap,
} from '../../../types';
import * as MapHash from './map';
import * as MapMark from './mark';

/**
 * 创建图纸服务的工厂函数
 * @param markMap 用于存储标记的 Map
 * @returns IMapHashService 实例
 */
export function createMapHashService(markMap: MarkMap): IMapHashService {
  return {
    createFromData({ parts, lines }) {
      for (const part of parts) {
        MapHash.setPartMark(part, markMap);
      }
      for (const line of lines) {
        MapHash.setLineMark(line, markMap);
      }
    },
    clearAll() {
      markMap.clear();
    },
    setMark(data) {
      if (!data) {
        return;
      }

      if (isPart(data)) {
        MapHash.setPartMark(data, markMap);
      }
      else {
        MapHash.setLineMark(data, markMap);
      }
    },
    removeMark(data) {
      if (!data) {
        return;
      }

      if (isPart(data)) {
        MapHash.deletePartMark(data, markMap);
      }
      else {
        MapHash.deleteLineMark(data, markMap);
      }
    },
    getAllMarks: () => MapHash.values(markMap),
    has: (position) => MapHash.has(markMap, position),
    get: (position) => MapHash.get(markMap, position),
    set: (data) => MapHash.set(markMap, data),
    delete: (position) => MapHash.remove(markMap, position),
    isLine: MapMark.isLine,
    isLinePoint: MapMark.isLinePoint,
    isLineCross: MapMark.isLineCross,
    isLineCover: MapMark.isLineCover,
    isPart: MapMark.isPart,
    isPartPin: MapMark.isPartPin,
    isPartPinLine: MapMark.isPartPinLine,
    isLineAndPoint: MapMark.isLineAndPoint,
    isLineAndLine: MapMark.isLineAndLine,
    isPartAndPin: MapMark.isPartAndPin,
    hasConnect: MapMark.hasConnect,
    hasLine: MapMark.hasLine,
    hasStraightLine: MapMark.hasStraightLine,
    isFullCross: MapMark.isFullCross,
    isNoConnect: MapMark.isNoConnect,
    inStraightLine: MapMark.inStraightLine,
    alongLineAndVector(data: any, vector: any, end?: any) {
      return MapMark.alongLineAndVector(data, vector, markMap, end) as any;
    },
    clone() {
      const newMarkMap = new Map(markMap);
      return createMapHashService(newMarkMap);
    },
  };
}
