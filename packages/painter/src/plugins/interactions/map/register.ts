import { isLine, getPartPin } from '@circuit/electronics';
import { MarkMap } from '@circuit/map';
import { definePlugin } from '../../../context';
import {
  MAP_SERVICE_KEY,
  LIFE_CYCLE_HOOK,
  ELECTRONIC_SERVICE_KEY,
  IMapService,
} from '../../../types';
import { getPinConnectionByPosition } from './connection';
import {
  setPartMark,
  setLineMark,
  deleteLineMark,
  deletePartMark,
} from './mark';

definePlugin(({ registerService, getService }) => {
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
    getPinConnectionByPosition(position) {
      return getPinConnectionByPosition(position, markService);
    },
    getPinConnectionByPin(id, pin) {
      const electronicService = getService(ELECTRONIC_SERVICE_KEY);

      if (isLine(id)) {
        const line = electronicService.getLine(id);
        const position = line.path[pin * (line.path.length - 1)];

        return getPinConnectionByPosition(position, markService)
          .filter((item) => item.id !== id);
      }
      else {
        const part = electronicService.getPart(id);
        const pinData = getPartPin(part, pin);

        return getPinConnectionByPosition(pinData.position, markService)
          .filter((item) => item.id !== id && item.pin !== pin);
      }
    },
  };

  // 注册图纸服务
  registerService(MAP_SERVICE_KEY, service);

  // 卸载器
  return () => {
    service.markService.clear();
  };
});
