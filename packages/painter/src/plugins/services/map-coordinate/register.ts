import { Point } from '@circuit/algorithm';
import { CONFIGURATION_SERVICE } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../context';
import {
  IMapCoordinateService,
  CURSOR_SERVICE,
  DRAG_SCENE_SERVICE,
  MAP_COORDINATE_SERVICE,
  EVENT_LISTENER_HOOK,
  DRAG_SCENE_HOOK,
} from '../../../types';

definePlugin(({ getService, registerHook, registerService }) => {
  const service: IMapCoordinateService = {
    value: new Watcher({
      position: new Point(0, 0),
      scale: 1,
    }),
    setScale(scale) {
      if (scale !== this.value.data.scale) {
        this.value.setData({
          scale,
          position: this.value.data.position,
        });
      }
    },
    setPosition(position) {
      if (!this.value.data.position.isEqual(position)) {
        this.value.setData({
          scale: this.value.data.scale,
          position,
        });
      }
    },
  };

  const minLimit = 20;
  const maxLimit = 100;
  const DragSceneName = 'DragBackground';

  // 注册滚轮缩放事件
  registerHook(EVENT_LISTENER_HOOK, {
    onMouseDown(event) {
      // 非左键或者鼠标按下事件不处理
      if (event.button !== 0 || event.type !== 'mousedown') {
        return;
      }

      const dragSceneService = getService(DRAG_SCENE_SERVICE);
      const configurationService = getService(CONFIGURATION_SERVICE);

      // 当前场景不为空或者不是移动模式时不处理
      if (dragSceneService.size !== 0 || !configurationService.movePainterMode.data) {
        return;
      }

      dragSceneService.trigger(DragSceneName, { event });
    },
    onMouseWheel(e) {
      const dragSceneService = getService(DRAG_SCENE_SERVICE);

      // 当前场景不为空时不处理
      if (dragSceneService.size !== 0) {
        return;
      }

      // 滚轮未滚动时不处理
      if (e.deltaY === 0) {
        return;
      }

      const domRect = e.currentTarget.getBoundingClientRect();
      const mousePosition = new Point(e.pageX - domRect.left, e.pageY - domRect.top);
      const { data: oldVal } = service.value;
      let size = oldVal.scale * 20;

      if (e.deltaY > 0) {
        size -= 5;
      }
      else if (e.deltaY < 0) {
        size += 5;
      }

      if (size < minLimit) {
        size = minLimit;
        return;
      }
      if (size > maxLimit) {
        size = maxLimit;
        return;
      }

      size = size / 20;

      service.value.setData({
        scale: size,
        position: oldVal.position
          .add(mousePosition, -1)
          .mul(size / oldVal.scale)
          .add(mousePosition)
          .round(1),
      });
    },
  });

  // 注册鼠标拖动背景事件
  registerHook(DRAG_SCENE_HOOK, {
    name: DragSceneName,
    isEnd(event) {
      const configuration = getService(CONFIGURATION_SERVICE);

      // 不是移动模式时直接停止
      if (!configuration.movePainterMode.data) {
        return true;
      }

      // 非左键或者鼠标抬起事件不处理
      if (event.button !== 0 || event.type !== 'mouseup') {
        return false;
      }

      const dragSceneService = getService(DRAG_SCENE_SERVICE);

      // 当前场景不是鼠标拖动背景场景时不处理
      if (!(
        dragSceneService.size === 1 &&
        dragSceneService.has(DragSceneName)
      )) {
        return false;
      }

      return true;
    },
    onDragMove(event) {
      service.setPosition(service.value.data.position.add(event.movement));
    },
    afterStart() {
      const cursorService = getService(CURSOR_SERVICE);
      cursorService.set(cursorService.kind.Dragging);
    },
    afterEnd() {
      const cursorService = getService(CURSOR_SERVICE);
      const configurationService = getService(CONFIGURATION_SERVICE);

      if (configurationService.movePainterMode.data) {
        cursorService.set(cursorService.kind.Drag);
      }
      else {
        cursorService.clear();
      }
    },
  });

  // 注册图纸坐标服务
  registerService(MAP_COORDINATE_SERVICE, service);

  // 卸载器
  return () => {
    service.value.destroy();
  };
});
