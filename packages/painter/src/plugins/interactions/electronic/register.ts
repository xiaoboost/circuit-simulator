import {
  PartStructuredData,
  LineStructuredData,
  ElectronicKind,
  Electronics,
} from '@circuit/electronics';
import { Watcher } from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import {
  ELECTRONIC_SERVICE_KEY,
  IElectronicService,
} from '../../../types';

definePlugin(({ registerService }) => {
  const service: IElectronicService = {
    parts: new Watcher<PartStructuredData[]>([]),
    lines: new Watcher<LineStructuredData[]>([]),
    commit: () => void 0,
    getPartPrototype(kind: ElectronicKind) {
      const result = Electronics[kind];

      if (!result) {
        throw new Error('未找到器件原型');
      }

      return result;
    },
    getPart(id) {
      const result = this.parts.data.find((item) => item.id === id);

      if (!result) {
        throw new Error(`无法获取器件: ${id}`);
      }

      return result;
    },
    getLine(id) {
      const result = this.lines.data.find((item) => item.id === id);

      if (!result) {
        throw new Error(`无法获取导线: ${id}`);
      }

      return result;
    },
  };

  // 注册元件服务
  registerService(ELECTRONIC_SERVICE_KEY, service);

  // 卸载器
  return () => {
    service.parts.unObserve();
    service.lines.unObserve();
  };
});
