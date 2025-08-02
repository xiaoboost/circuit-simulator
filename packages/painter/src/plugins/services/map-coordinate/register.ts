import { Point } from '@circuit/algorithm';
import { definePlugin, Watcher } from '../../../context';
import {
  IMapCoordinateService,
  CURSOR_SERVICE,
  DRAG_SCENE_SERVICE,
  MAP_COORDINATE_SERVICE,
  EVENT_LISTENER_HOOK,
  DRAG_SCENE_HOOK,
  PAINTER_HTML_ELEMENT,
  PAINTER_CONFIGURATION_SERVICE,
} from '../../../types';

definePlugin(({ getService, registerHook, registerService }) => {
  const service: IMapCoordinateService = {
    ScaleMin: 0.5,
    ScaleMax: 2,
    scale: new Watcher(1),
    position: new Watcher(new Point(0, 0)),
    zoomIn() {
      let size = this.scale.data + 0.1;

      if (size > this.ScaleMax) {
        size = this.ScaleMax;
      }

      this.setScale(size);
    },
    zoomOut() {
      let size = this.scale.data - 0.1;

      if (size < this.ScaleMin) {
        size = this.ScaleMin;
      }

      this.setScale(size);
    },
    setScale(scale) {
      this.scale.setData(Math.round(scale * 10) / 10);
    },
    setPosition(position) {
      if (!this.position.data.isEqual(position)) {
        this.position.setData(position);
      }
    },
    screenToViewPosition(position) {
      // TODO: 这里应该可以优化吧，每次都获取一次元素的`BoundingClientRect`太浪费性能了
      const painterElement = getService(PAINTER_HTML_ELEMENT);
      const { left, top } = painterElement.current!.getBoundingClientRect();
      return position.add([left, top], -1);
    },
    screenToMapPosition(position) {
      return this.viewToMapPosition(this.screenToViewPosition(position));
    },
    viewToMapPosition(input) {
      const { scale: { data: scale }, position: { data: position } } = this;
      return input.add(position, -1).mul(scale, -1);
    },
    mapToViewPosition(mapCoordinate) {
      const { scale: { data: scale }, position: { data: position } } = this;
      return mapCoordinate.mul(scale).add(position);
    },
  };

  const DragSceneName = 'DragBackground';

  // 注册滚轮缩放事件
  registerHook(EVENT_LISTENER_HOOK, {
    order: 0,
    onMouseDown(event) {
      // 非左键或者鼠标按下事件不处理
      if (event.button !== 0 || event.type !== 'mousedown') {
        return;
      }

      const dragSceneService = getService(DRAG_SCENE_SERVICE);
      const configurationService = getService(PAINTER_CONFIGURATION_SERVICE);

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
      const { scale, position } = service;
      const oldScale = scale.data;

      if (e.deltaY > 0) {
        service.zoomOut();
      }
      else if (e.deltaY < 0) {
        service.zoomIn();
      }

      service.position.setData(
        position.data
          .add(mousePosition, -1)
          .mul(scale.data / oldScale)
          .add(mousePosition)
          .round(1),
      );
    },
  });

  // 注册鼠标拖动背景事件
  registerHook(DRAG_SCENE_HOOK, {
    name: DragSceneName,
    isEnd(event) {
      const configuration = getService(PAINTER_CONFIGURATION_SERVICE);
      const dragSceneService = getService(DRAG_SCENE_SERVICE);

      // 不是移动模式时直接停止
      if (!configuration.movePainterMode.data) {
        return true;
      }

      return dragSceneService.isLeftMouseUpNoMovingHasScene(event, DragSceneName);
    },
    onDragMove(event) {
      service.setPosition(service.position.data.add(event.movement));
    },
    afterStart() {
      const cursorService = getService(CURSOR_SERVICE);
      cursorService.set(cursorService.kind.Dragging);
    },
    afterEnd() {
      const cursorService = getService(CURSOR_SERVICE);
      const configurationService = getService(PAINTER_CONFIGURATION_SERVICE);

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
    service.scale.destroy();
    service.position.destroy();
  };
});
