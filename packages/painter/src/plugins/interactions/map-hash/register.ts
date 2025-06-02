import { MarkMap } from '@circuit/map';
import { definePlugin } from '../../../context';
import {
  MAP_HASH_SERVICE,
  IMapService,
} from '../../../types';
import {
  setPartMark,
  setLineMark,
  deleteLineMark,
  deletePartMark,
} from './mark';

definePlugin(({ registerService }) => {
  const markService = new MarkMap();
  const service: IMapService = {
    markService,
    setPartMark(data) {
      return setPartMark(data, markService);
    },
    setLineMark(data) {
      return setLineMark(data, markService);
    },
    deletePartMark(data) {
      return deletePartMark(data, markService);
    },
    deleteLineMark(data) {
      return deleteLineMark(data, markService);
    },
  };

  // 注册图纸服务
  registerService(MAP_HASH_SERVICE, service);

  // 卸载器
  return () => {
    service.markService.clear();
  };
});
