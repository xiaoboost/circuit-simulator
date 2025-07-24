import { definePlugin } from '../../../context';
import {
  MAP_HASH_SERVICE,
  IMapService,
  MarkMap,
  Mark,
} from '../../../types';
import * as Map from './map';

definePlugin(({ registerService }) => {
  const markMap: MarkMap = {};
  const service: IMapService = {
    getMap() {
      return markMap;
    },
    setPartMark(data) {
      return Map.setPartMark(data, markMap);
    },
    setLineMark(data) {
      return Map.setLineMark(data, markMap);
    },
    deletePartMark(data) {
      return Map.deletePartMark(data, markMap);
    },
    deleteLineMark(data) {
      return Map.deleteLineMark(data, markMap);
    },
    getAllMarks() {
      return Map.values(markMap);
    },
    getAssert(kind) {
      return ((mark: Mark) => mark.kind === kind) as any;
    },
  };

  // 注册图纸服务
  registerService(MAP_HASH_SERVICE, service);
});
