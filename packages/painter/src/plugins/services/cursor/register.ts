import { Point } from '@circuit/algorithm';
import { IStateCoreService } from '@circuit/contracts/global';
import {
  definePlugin,
  ICursorService,
  CursorKind,
  IHoverService,
  EntityKind,
} from '@circuit/contracts/painter';
import { ILifeCycleHook } from '@circuit/inject';
import { Watcher } from '@circuit/reactive';

definePlugin(({ registerService, registerHook, getServices }) => {
  let defaultCursor = CursorKind.Default;
  let highPriorityCursor: CursorKind | undefined;

  const services = getServices({
    hover: IHoverService,
    state: IStateCoreService,
  });

  const service: ICursorService = {
    value: new Watcher<CursorKind>(CursorKind.Default),
    kind: CursorKind,
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
    onMounted() {
      services.hover.current.observe((val) => {
        if (
          !val || val.kind === EntityKind.Part
        ) {
          defaultCursor = CursorKind.Default;
        }
        else if (
          val.kind === EntityKind.PartPin || val.kind === EntityKind.LinePin
        ) {
          defaultCursor = CursorKind.DrawLine;
        }
        else if (val.kind === EntityKind.Line) {
          const line = services.state.getLine(val.id);
          const lineSegmentVector = new Point(line.path[val.index], line.path[val.index + 1]);

          defaultCursor = lineSegmentVector.isHorizontal()
            ? CursorKind.ResizeNS
            : CursorKind.ResizeEW;
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
