import {
  PartStructuredData,
  LineStructuredData,
  ElectronicKind,
  Electronics,
} from '@circuit/electronics';
import { Watcher } from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import { ELECTRONIC_SERVICE_KEY, IElectronicService } from '../../../types';

definePlugin(({ registerService }) => {
  const service: IElectronicService = {
    parts: new Watcher<PartStructuredData[]>([]),
    lines: new Watcher<LineStructuredData[]>([]),
    getPartPrototype(kind: ElectronicKind) {
      return Electronics[kind];
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
