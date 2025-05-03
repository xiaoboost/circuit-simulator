import { Point } from '@circuit/math';
import type { MouseEvent } from 'react';
import { definePlugin } from '../../../context';
import {
  IDragSceneService,
  DRAG_SCENE_SERVICE,
  DRAG_SCENE_HOOK,
  EVENT_LISTENER_HOOK,
  MAP_COORDINATE_SERVICE,
  DragMouseEvent,
  DragMoveEvent,
} from '../../../types';

definePlugin(({ registerService, registerHook, getHook, getService }) => {
  const service: IDragSceneService = new Set<string>();

  function getDragMouseEvent(event: MouseEvent<HTMLElement>) {
    const { left, top } = event.currentTarget.getBoundingClientRect();
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
      const isStart = hook.start(dragMouseEvent);

      if (isStart) {
        // 先触发开始事件，然后再添加场景
        Promise.resolve()
          .then(() => hook.afterStart?.())
          .then(() => service.add(hook.name));
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

      if (isEnd) {
        // 先移除场景，再触发结束事件
        Promise.resolve()
          .then(() => service.delete(hook.name))
          .then(() => hook.afterEnd?.());
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
            const dragMoveEvent: DragMoveEvent = {
              ...getDragMouseEvent(event),
              movement,
              movementInDrawer: movement.mul(map.value.data.scale, -1),
            };

            for (const hook of hooks) {
              hook.onDragMove(dragMoveEvent);
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
