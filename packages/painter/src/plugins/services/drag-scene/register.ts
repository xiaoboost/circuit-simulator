import { Point } from '@circuit/algorithm';
import { IHotKeyHook } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import {
  DragMouseEvent,
  DragMoveEvent,
  DragSceneHookPayload,
  IDragSceneService,
  IDragSceneHook,
  IEventListenerHook,
  IMapCoordinateService,
  IPainterConfigurationService,
} from '../../../types';

definePlugin(({ registerService, registerHook, getHook, getService }) => {
  const sceneSet = new Set<string>();
  const triggerPayloadMap = new Map<string, any>();
  const isMovedMap = new Map<string, boolean>();
  const startPositionMap = new Map<string, Point>();
  const service: IDragSceneService = {
    isDragging: new Watcher(false),
    get size() {
      return sceneSet.size;
    },
    has(name) {
      return sceneSet.has(name);
    },
    forEach(callback) {
      sceneSet.forEach(callback);
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

      sceneSet.add(scene);
      isMovedMap.set(scene, false);
      triggerPayloadMap.set(scene, startPayload);
      service.isDragging.setData(sceneSet.size !== 0);

      // 初始事件可能是空，因为不一定是从鼠标事件触发的
      if (startPayload?.event) {
        startPositionMap.set(scene, startPayload.event.position);
      }
    },
    triggerEnd(scene, payload) {
      if (scene !== '*' && !service.has(scene)) {
        return;
      }

      const hooks = getHook(IDragSceneHook).filter(({ name }) => {
        return (
          (scene === '*' || name === scene)
          && sceneSet.has(name)
        );
      });

      Promise.resolve()
        // 先删除场景记录
        .then(() => {
          hooks.forEach(({ name }) => {
            sceneSet.delete(name);
            isMovedMap.delete(name);
            service.isDragging.setData(sceneSet.size !== 0);
          });
        })
        // 触发结束/取消事件
        .then(() => {
          const hookKey = payload?.esc ? 'onCancel' : 'afterEnd';

          hooks.forEach(({ name, [hookKey]: hook }) => {
            const triggerPayload = triggerPayloadMap.get(name);
            const endPayload: DragSceneHookPayload | undefined = payload?.event
              ? {
                ...payload,
                event: getDragMouseEvent(payload.event),
              }
              : payload as any;

            hook?.(triggerPayload, endPayload);
          });
        })
        // 最后删除记录数据
        .then(() => {
          hooks.forEach(({ name }) => {
            triggerPayloadMap.delete(name);
            startPositionMap.delete(name);
          });
        });
    },
    onlyHas(scene) {
      return sceneSet.size === 1 && sceneSet.has(scene);
    },
    isLeftMouseDownNoMovingNoScene(event) {
      return (
        event.button === 0
        && event.type === 'mousedown'
        && this.size === 0
        && !getService(IPainterConfigurationService).movePainterMode.data
      );
    },
    isLeftMouseUpNoMovingHasScene(event, scene) {
      return (
        event.button === 0
        && event.type === 'mouseup'
        && sceneSet.has(scene)
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

  function endCb(event: MouseEvent) {
    if (service.size === 0) {
      return;
    }

    const dragHook = getHook(IDragSceneHook);
    // 正在进行中的场景
    const hooks = dragHook.filter((hook) => service.has(hook.name));

    if (hooks.length === 0) {
      return;
    }

    const dragMouseEvent = getDragMouseEvent(event);

    for (const hook of hooks) {
      const isEnd = hook.isEnd(dragMouseEvent);
      const triggerPayload = triggerPayloadMap.get(hook.name);

      if (isEnd) {
        // 先移除场景，再触发结束事件
        Promise.resolve()
          .then(() => {
            sceneSet.delete(hook.name);
            isMovedMap.delete(hook.name);
            triggerPayloadMap.delete(hook.name);
            startPositionMap.delete(hook.name);
            service.isDragging.setData(sceneSet.size !== 0);
          })
          .then(() => hook.afterEnd?.(triggerPayload, { event: dragMouseEvent }));
      }
    }
  }

  /**
   * 上个鼠标位置
   *
   * @description 这里是画布位置
   */
  let lastMousePosition: Point | null = null;

  // 注册原始事件钩子
  registerHook(IEventListenerHook, {
    onClick(event) {
      endCb(event);
    },
    onDblClick(event) {
      endCb(event);
    },
    onMouseDown(event) {
      endCb(event);
    },
    onMouseUp(event) {
      endCb(event);
    },
    onMouseEnter(event) {
      endCb(event);
    },
    onMouseLeave(event) {
      endCb(event);
    },
  });

  // 注册拖拽场景实现钩子
  registerHook(IEventListenerHook, {
    // 这个事件的优先级较低
    order: 10,
    onMouseMove(event) {
      if (service.size !== 0) {
        const dragHook = getHook(IDragSceneHook);
        const hooks = dragHook.filter((hook) => service.has(hook.name));

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

              // 这里必须是等于 false
              if (isMovedMap.get(hook.name) === false && hook.onFirstDragMove) {
                hook.onFirstDragMove(dragMoveEvent, payload);
              }
              else {
                hook.onDragMove(dragMoveEvent, payload);
              }
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
});
