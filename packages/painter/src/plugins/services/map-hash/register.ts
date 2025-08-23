import { definePlugin } from '../../../context';
import {
  MAP_HASH_SERVICE,
  IMapHashService,
  MarkMap,
} from '../../../types';
import * as Map from './map';
import * as MapMark from './mark';

definePlugin(({ registerService }) => {
  const markMap: MarkMap = {};
  const service: IMapHashService = {
    createFromData({ parts, lines }) {
      for (const part of parts) {
        Map.setPartMark(part, markMap);
      }
      for (const line of lines) {
        Map.setLineMark(line, markMap);
      }
    },
    setPartMark: (data) => Map.setPartMark(data, markMap),
    setLineMark: (data) => Map.setLineMark(data, markMap),
    deletePartMark: (data) => Map.deletePartMark(data, markMap),
    deleteLineMark: (data) => Map.deleteLineMark(data, markMap),
    getAllMarks: () => Map.values(markMap),
    has: (position) => Map.has(markMap, position),
    get: (position) => Map.get(markMap, position),
    set: (data) => Map.set(markMap, data),
    delete: (position) => Map.remove(markMap, position),
    isLine: MapMark.isLine,
    isLinePoint: MapMark.isLinePoint,
    isLineCross: MapMark.isLineCross,
    isLineCover: MapMark.isLineCover,
    isPart: MapMark.isPart,
    isPartPin: MapMark.isPartPin,
    isPartPinLine: MapMark.isPartPinLine,
    isLineAndPoint: MapMark.isLineAndPoint,
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
  };

  // 注册图纸服务
  registerService(MAP_HASH_SERVICE, service);
});
