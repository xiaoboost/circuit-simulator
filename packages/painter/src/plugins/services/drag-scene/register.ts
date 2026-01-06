import { Point } from '@circuit/algorithm';
import { IHotKeyHook } from '@circuit/contracts/global';
import {
  definePlugin,
  DragMouseEvent,
  DragMoveEvent,
  DragSceneHookPayload,
  IDragSceneService,
  IDragSceneHook,
  IEventListenerHook,
  IMapCoordinateService,
  IPainterConfigurationService,
} from '@circuit/contracts/painter';
import { Watcher } from '@circuit/reactive';
import { nextFrame } from '@circuit/shared';

definePlugin(({ registerService, registerHook, getHook, getService }) => {
  const scenesWatcher = new Watcher<Set<string>>(new Set());
  const triggerPayloadMap = new Map<string, any>();
  const isMovedMap = new Map<string, boolean>();
  const startPositionMap = new Map<string, Point>();
  const service: IDragSceneService = {
    scenes: scenesWatcher,
    isDragging() {
      return scenesWatcher.data.size > 0;
    },
    trigger(scene, payload) {
      const startPayload: DragSceneHookPayload | undefined = payload?.event
        ? {
          ...payload,
          event: getDragMouseEvent(payload.event),
        }
        : payload as any;

      // 触发之后立即运行
      getHook(IDragSceneHook)
        .find(({ name }) => name === scene)
        ?.afterStart?.(startPayload);

      // 更新场景集合
      const newSet = new Set(scenesWatcher.data);
      newSet.add(scene);
      scenesWatcher.setData(newSet);

      isMovedMap.set(scene, false);
      triggerPayloadMap.set(scene, startPayload);

      // 初始事件可能是空，因为不一定是从鼠标事件触发的
      if (startPayload?.event) {
        startPositionMap.set(scene, startPayload.event.position);
      }
    },
    triggerEnd(scene, payload) {
      if (scene !== '*' && !scenesWatcher.data.has(scene)) {
        return;
      }

      const hooks = getHook(IDragSceneHook).filter(({ name }) => {
        return (
          (scene === '*' || name === scene)
          && scenesWatcher.data.has(name)
        );
      });
      const beforeKey = payload?.esc ? 'beforeCancel' : 'beforeEnd';
      const afterKey = payload?.esc ? 'afterCancel' : 'afterEnd';
      const isMoved = isMovedMap.get(scene);
      const endPayload = payload?.event
        ? { ...payload, isMoved, event: getDragMouseEvent(payload.event) }
        : { ...payload, isMoved } as any;
      const startPayload = hooks.map(({ name }) => triggerPayloadMap.get(name));
      const run = (key: typeof beforeKey | typeof afterKey) => {
        return Promise.all(hooks.map(({ [key]: hook }, index) => {
          hook?.(startPayload[index], endPayload);
        }));
      };
      const clear = () => {
        // 更新场景集合
        const newSet = new Set(scenesWatcher.data);
        hooks.forEach(({ name }) => {
          newSet.delete(name);
          isMovedMap.delete(name);
          triggerPayloadMap.delete(name);
          startPositionMap.delete(name);
        });
        scenesWatcher.setData(newSet);
      };

      nextFrame()
        .then(() => run(beforeKey))
        .then(() => clear())
        .then(() => run(afterKey));
    },
    onlyHas(scene) {
      return scenesWatcher.data.size === 1 && scenesWatcher.data.has(scene);
    },
    isLeftMouseDownNoMovingNoScene(event) {
      return (
        event.button === 0
        && event.type === 'mousedown'
        && !service.isDragging()
        && !getService(IPainterConfigurationService).movePainterMode.data
      );
    },
    isLeftMouseUpNoMovingHasScene(event, scene) {
      return (
        event.button === 0
        && event.type === 'mouseup'
        && scenesWatcher.data.has(scene)
      );
    },
  };

  function getDragMouseEvent(event: MouseEvent) {
    const mapService = getService(IMapCoordinateService);
    const mousePosition = mapService.screenToViewPosition(Point.from([event.pageX, event.pageY]));
    const positionInDrawer = mapService.viewToMapPosition(mousePosition);
    const dragMouseEvent: DragMouseEvent = new Proxy(event, {
      get(target, prop) {
        switch (prop) {
          case 'position':
            return mousePosition;
          case 'positionInDrawer':
            return positionInDrawer;
          default:
            return Reflect.get(target, prop);
        }
      },
    }) as any;

    return dragMouseEvent;
  }

  /**
   * 上个鼠标位置
   *
   * @description 这里是画布位置
   */
  let lastMousePosition: Point | null = null;

  // 注册拖拽场景实现钩子
  registerHook(IEventListenerHook, {
    // 这个事件的优先级较低
    order: 10,
    onMouseMove(event) {
      if (service.isDragging()) {
        const dragHook = getHook(IDragSceneHook);
        const hooks = dragHook.filter((hook) => scenesWatcher.data.has(hook.name));

        if (hooks.length !== 0) {
          const map = getService(IMapCoordinateService);
          const movement = lastMousePosition
            ? new Point(event.pageX, event.pageY).add(lastMousePosition, -1)
            : new Point(0, 0);

          if (!movement.isZero()) {
            const movementInDrawer = movement.mul(map.scale.data, -1);
            const dragMouseEvent = getDragMouseEvent(event);

            for (const hook of hooks) {
              // 初始时没有开始位置，设置开始位置，然后跳过首次处理
              if (!startPositionMap.has(hook.name)) {
                startPositionMap.set(hook.name, dragMouseEvent.position);
                continue;
              }

              const movementAcc = dragMouseEvent.position.add(startPositionMap.get(hook.name)!, -1);
              const movementInDrawerAcc = movementAcc.mul(map.scale.data, -1);
              const payload = triggerPayloadMap.get(hook.name);
              const dragMoveEvent: DragMoveEvent = new Proxy(dragMouseEvent, {
                get(target, prop) {
                  switch (prop) {
                    case 'movement':
                      return movement;
                    case 'movementInDrawer':
                      return movementInDrawer;
                    case 'movementAcc':
                      return movementAcc;
                    case 'movementInDrawerAcc':
                      return movementInDrawerAcc;
                    default:
                      return Reflect.get(target, prop);
                  }
                },
              }) as any;

              if (!isMovedMap.get(hook.name) && hook.onFirstDragMove) {
                hook.onFirstDragMove(dragMoveEvent, payload);
              }
              else {
                hook.onDragMove(dragMoveEvent, payload);
              }

              // 只要移动过，这里就要设置为 true
              isMovedMap.set(hook.name, true);
            }
          }
        }
      }

      lastMousePosition = new Point(event.pageX, event.pageY);
    },
  });

  // 键盘按下`Esc`时取消拖拽事件钩子
  registerHook(IHotKeyHook, {
    key: 'esc',
    name: '取消拖拽事件',
    action: () => {
      service.triggerEnd('*', { esc: true });
    },
  });

  // 注册鼠标拖动服务
  registerService(IDragSceneService, service);

  return () => {
    scenesWatcher.destroy();
  };
});
