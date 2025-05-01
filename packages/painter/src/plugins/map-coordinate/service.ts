import { Point } from '@circuit/math';
import { definePlugin, Watcher } from '../../context';
import type { IMapCoordinateService } from '../../types';
import { MAP_COORDINATE_SERVICE } from './constant';

definePlugin(({ registerHook, registerService }) => {
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
      if (this.value.data.position.isEqual(position)) {
        this.value.setData({
          scale: this.value.data.scale,
          position,
        });
      }
    },
  };

  // 注册滚轮缩放事件
  registerHook({
    kind: 'EventListener',
    onMouseWheel(e) {
      const mousePosition = new Point(e.pageX, e.pageY);
      const { data: oldVal } = service.value;
      let size = oldVal.scale * 20;

      if (e.deltaY > 0) {
        size -= 5;
      }
      else if (e.deltaY < 0) {
        size += 5;
      }

      if (size < 20) {
        size = 20;
        return;
      }
      if (size > 80) {
        size = 80;
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
  registerHook({
    kind: 'DragScene',
    name: 'DragBackground',
    start(event) {
      return false;
    },
    isEnd(event) {
      return false;
    },
    onDragMove(event) {

    },
  });

  // 注册图纸坐标服务
  registerService(MAP_COORDINATE_SERVICE, service);

  // 卸载器
  return () => {
    service.value.unObserve();
  };
});
