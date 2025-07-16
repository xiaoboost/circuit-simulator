import { Point } from '@circuit/algorithm';
import type { MouseEvent } from 'react';
import { definePlugin } from '../../../context';
import {
  DragMouseEvent,
  DragSceneHookPayload,
  IDragSceneService,
  DRAG_SCENE_SERVICE,
  DRAG_SCENE_HOOK,
  EVENT_LISTENER_HOOK,
  MAP_COORDINATE_SERVICE,
  PAINTER_HTML_ELEMENT,
} from '../../../types';

definePlugin(({ registerService, registerHook, getHook, getService }) => {
  const sceneSet = new Set<string>();
  const triggerPayloadMap = new Map<string, any>();
  const startPositionMap = new Map<string, Point>();
  const service: IDragSceneService = {
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
      getHook(DRAG_SCENE_HOOK)
        .find(({ name }) => name === scene)
        ?.afterStart?.(startPayload);

      sceneSet.add(scene);
      triggerPayloadMap.set(scene, startPayload);

      // 初始事件可能是空，因为不一定是从鼠标事件触发的
      if (startPayload?.event) {
        startPositionMap.set(scene, startPayload.event.position);
      }
    },
    triggerEnd(scene, payload) {
      if (!service.has(scene)) {
        return;
      }

      const triggerPayload = triggerPayloadMap.get(scene);
      const hook = getHook(DRAG_SCENE_HOOK).find(({ name }) => name === scene);
      const endPayload: DragSceneHookPayload | undefined = payload?.event
        ? {
          ...payload,
          event: getDragMouseEvent(payload.event),
        }
        : payload as any;

      // 先移除场景，再触发结束事件
      Promise.resolve()
        .then(() => {
          sceneSet.delete(scene);
          triggerPayloadMap.delete(scene);
          startPositionMap.delete(scene);
        })
        .then(() => hook?.afterEnd?.(triggerPayload, endPayload));
    },
    onlyHas(scene) {
      return sceneSet.size === 1 && sceneSet.has(scene);
    },
  };

  function getDragMouseEvent(event: MouseEvent) {
    const painterElement = getService(PAINTER_HTML_ELEMENT);
    const { left, top } = painterElement.current!.getBoundingClientRect();
    const { value: { data: map } } = getService(MAP_COORDINATE_SERVICE);
    const mousePosition = new Point(event.pageX - left, event.pageY - top);
    const dragMouseEvent: DragMouseEvent = {
      ...event,
      position: mousePosition,
      positionInDrawer: mousePosition.add(map.position, -1).mul(map.scale, -1),
    };

    return dragMouseEvent;
  }

  function endCb(event: MouseEvent) {
    if (service.size === 0) {
      return;
    }

    const dragHook = getHook(DRAG_SCENE_HOOK);
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
            triggerPayloadMap.delete(hook.name);
            startPositionMap.delete(hook.name);
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
  registerHook(EVENT_LISTENER_HOOK, {
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
    onMouseMove(event) {
      if (service.size !== 0) {
        const dragHook = getHook(DRAG_SCENE_HOOK);
        const hooks = dragHook.filter((hook) => service.has(hook.name));

        if (hooks.length !== 0) {
          const map = getService(MAP_COORDINATE_SERVICE);
          const movement = lastMousePosition
            ? new Point(event.pageX, event.pageY).add(lastMousePosition, -1)
            : new Point(0, 0);

          if (!movement.isZero()) {
            const movementInDrawer = movement.mul(map.value.data.scale, -1);
            const dragMouseEvent = getDragMouseEvent(event);

            for (const hook of hooks) {
              // 初始时没有开始位置，设置开始位置，然后跳过首次处理
              if (!startPositionMap.has(hook.name)) {
                startPositionMap.set(hook.name, dragMouseEvent.position);
                continue;
              }

              const movementAcc = dragMouseEvent.position.add(startPositionMap.get(hook.name)!, -1);
              const movementInDrawerAcc = movementAcc.mul(map.value.data.scale, -1);
              const payload = triggerPayloadMap.get(hook.name);

              hook.onDragMove({
                ...dragMouseEvent,
                movement,
                movementInDrawer,
                movementAcc,
                movementInDrawerAcc,
              }, payload);
            }
          }
        }
      }

      lastMousePosition = new Point(event.pageX, event.pageY);
    },
  });

  // 注册鼠标拖动服务
  registerService(DRAG_SCENE_SERVICE, service);
});
