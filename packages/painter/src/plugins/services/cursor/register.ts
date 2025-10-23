import { Point } from '@circuit/algorithm';
import { ILifeCycleHook, IStateCoreService } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import {
  ICursorService,
  ICursorKind,
  IHoverService,
  EntityKind,
} from '../../../types';

definePlugin(({ registerService, registerHook, getServices }) => {
  let defaultCursor = ICursorKind.Default;
  let highPriorityCursor: ICursorKind | undefined;

  const services = getServices({
    hover: IHoverService,
    state: IStateCoreService,
  });

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
  registerHook(ILifeCycleHook, {
    onCreated() {
      services.hover.current.observe((val) => {
        if (
          !val || val.kind === EntityKind.Part
        ) {
          defaultCursor = ICursorKind.Default;
        }
        else if (
          val.kind === EntityKind.PartPin || val.kind === EntityKind.LinePin
        ) {
          defaultCursor = ICursorKind.DrawLine;
        }
        else if (val.kind === EntityKind.Line) {
          const line = services.state.getLine(val.id);
          const lineSegmentVector = new Point(line.path[val.index], line.path[val.index + 1]);

          defaultCursor = lineSegmentVector.isHorizontal()
            ? ICursorKind.ResizeNS
            : ICursorKind.ResizeEW;
        }

        // 外部设置地指针优先级更高
        service.value.setData(highPriorityCursor ?? defaultCursor);
      });
    },
  });

  // 注册鼠标指针服务
  registerService(ICursorService, service);

  // 卸载器
  return () => {
    service.value.destroy();
  };
});
