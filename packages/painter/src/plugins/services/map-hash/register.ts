import { definePlugin } from '../../../context';
import {
  MAP_HASH_SERVICE,
  IMapService,
} from '../../../types';
import { Map } from './map';

definePlugin(({ registerService }) => {
  const markMap: Map.MarkMap = {};
  const service: IMapService = {
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
  };

  // 注册图纸服务
  registerService(MAP_HASH_SERVICE, service);
});
