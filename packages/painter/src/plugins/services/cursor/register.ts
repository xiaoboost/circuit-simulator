import { LIFE_CYCLE_HOOK } from '@circuit/shared';
import { EntityKind } from '@circuit/types';
import { definePlugin, Watcher } from '../../../context';
import {
  ICursorService,
  ICursorKind,
  CURSOR_SERVICE,
  HOVER_SERVICE,
} from '../../../types';

definePlugin(({ registerService, registerHook, getService }) => {
  let defaultCursor = ICursorKind.Default;
  let highPriorityCursor: ICursorKind | undefined;

  const service: ICursorService = {
    value: new Watcher<ICursorKind>(ICursorKind.Default),
    kind: ICursorKind,
    set(kind) {
      highPriorityCursor = kind;
      this.value.setData(highPriorityCursor ?? defaultCursor);
    },
    clear() {
      highPriorityCursor = undefined;
      this.value.setData(highPriorityCursor ?? defaultCursor);
    },
  };

  // 监听 Hover 状态
  registerHook(LIFE_CYCLE_HOOK, {
    afterPluginInit() {
      getService(HOVER_SERVICE).status.observe((val) => {
        if (!val) {
          defaultCursor = ICursorKind.Default;
        }
        else if (
          val.kind === EntityKind.PartPin ||
          val.kind === EntityKind.LinePin
        ) {
          defaultCursor = ICursorKind.DrawLine;
        }

        // 外部设置地指针优先级更高
        service.value.setData(highPriorityCursor ?? defaultCursor);
      });
    },
  });

  // 注册鼠标指针服务
  registerService(CURSOR_SERVICE, service);

  // 卸载器
  return () => {
    service.value.destroy();
  };
});
