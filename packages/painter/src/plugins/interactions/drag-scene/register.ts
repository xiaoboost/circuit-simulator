import { Point } from '@circuit/algorithm';
import type { MouseEvent } from 'react';
import { definePlugin } from '../../../context';
import {
  IDragSceneService,
  DRAG_SCENE_SERVICE,
  DRAG_SCENE_HOOK,
  EVENT_LISTENER_HOOK,
  MAP_COORDINATE_SERVICE,
  DragMouseEvent,
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
      if (!payload.event) {
        throw new Error('触发场景事件回调参数中必须包含鼠标事件数据！');
      }

      // 触发之后立即运行
      getHook(DRAG_SCENE_HOOK)
        .find(({ name }) => name === scene)
        ?.afterStart?.(payload);

      sceneSet.add(scene);
      triggerPayloadMap.set(scene, payload);
      startPositionMap.set(scene, getDragMouseEvent(payload.event).position);
    },
    onlyHas(scene) {
      return sceneSet.size === 1 && sceneSet.has(scene);
    },
  };

  function getDragMouseEvent(event: MouseEvent<HTMLElement>) {
    const painterElement = getService(PAINTER_HTML_ELEMENT);
    const { left, top } = painterElement.current!.getBoundingClientRect();
    const { value: { data: map } } = getService(MAP_COORDINATE_SERVICE);
    const mousePosition = new Point(event.pageX - left, event.pageY - top);
    const mapPosition = map.position.mul(map.scale, -1);
    const dragMouseEvent: DragMouseEvent = {
      ...event,
      position: mousePosition,
      positionInDrawer: mousePosition.add(mapPosition, -1),
    };

    return dragMouseEvent;
  }

  function startCb(event: MouseEvent<HTMLElement>) {
    const dragHook = getHook(DRAG_SCENE_HOOK);
    // 未进行的场景
    const hooks = dragHook.filter((hook) => !service.has(hook.name));

    if (hooks.length === 0) {
      return;
    }

    const dragMouseEvent = getDragMouseEvent(event);

    for (const hook of hooks) {
      const isStart = hook.start?.(dragMouseEvent);

      if (isStart) {
        // 先触发开始事件，然后再添加场景
        Promise.resolve()
          .then(() => {
            hook.afterStart?.();
            startPositionMap.set(hook.name, Point.from(dragMouseEvent.position));
          })
          .then(() => sceneSet.add(hook.name));
      }
    }
  }

  function endCb(event: MouseEvent<HTMLElement>) {
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
          .then(() => hook.afterEnd?.(triggerPayload));
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
      startCb(event);
      endCb(event);
    },
    onDblClick(event) {
      startCb(event);
      endCb(event);
    },
    onMouseDown(event) {
      startCb(event);
      endCb(event);
    },
    onMouseUp(event) {
      startCb(event);
      endCb(event);
    },
    onMouseEnter(event) {
      startCb(event);
      endCb(event);
    },
    onMouseLeave(event) {
      startCb(event);
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
