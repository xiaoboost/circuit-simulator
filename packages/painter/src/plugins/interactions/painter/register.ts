import {
  PartStructuredData,
  LineStructuredData,
  ElectronicKind,
  Electronics,
} from '@circuit/electronics';
import { Watcher } from '@xiao-ai/utils';
import { definePlugin } from '../../../context';
import {
  PAINTER_SERVICE_KEY,
  IPainterService,
} from '../../../types';

definePlugin(({ registerService }) => {
  const service: IPainterService = {
    parts: new Watcher<PartStructuredData[]>([]),
    lines: new Watcher<LineStructuredData[]>([]),
    canUndo: new Watcher<boolean>(false),
    canRedo: new Watcher<boolean>(false),
    isReady: new Watcher<boolean>(false),
    undo: () => void 0,
    redo: () => void 0,
    commit: () => void 0,
    draft: () => void 0,
    dropDraft: () => void 0,
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
  registerService(PAINTER_SERVICE_KEY, service);

  // 卸载器
  return () => {
    service.parts.unObserve();
    service.lines.unObserve();
    service.canUndo.unObserve();
    service.canRedo.unObserve();
  };
});
