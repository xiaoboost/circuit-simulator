import { Point } from '@circuit/algorithm';
import React, { memo } from 'react';
import {
  Watcher,
  definePlugin,
  useWatcher,
  usePainterService,
} from '../../../context';
import {
  DRAW_LAYER_HOOK,
  MAP_COORDINATE_SERVICE,
  DRAG_SCENE_HOOK,
  DRAG_SCENE_SERVICE,
  SELECT_SERVICE,
  EVENT_LISTENER_HOOK,
  CONFIGURATION_SERVICE,
} from '../../../types';
import {
  SELECT_BOX_WIDTH,
  SELECT_BOX_MIN_MOVE_DISTANCE,
  SELECT_BOX_DRAG_SCENE_NAME,
} from './constant';
import * as Styles from './styles.less';

function toPath(start: Point, end: Point) {
  const [left, top] = start;
  const [right, bottom] = end;
  return `M${left},${top}L${right},${top}L${right},${bottom}L${left},${bottom}Z`;
}

definePlugin(({ registerHook, getService }) => {
  /** 起点坐标 */
  const start = new Watcher<Point>(Point.from(0));
  /** 终点坐标 */
  const end = new Watcher<Point>(Point.from(0));

  // 选择框组件
  function SelectBox() {
    const [{ scale }] = useWatcher(usePainterService(MAP_COORDINATE_SERVICE).value);
    const [startPosition] = useWatcher(start);
    const [endPosition] = useWatcher(end);

    // 距离差异小于限制则不显示
    if (startPosition.distance(endPosition) < SELECT_BOX_MIN_MOVE_DISTANCE) {
      return null;
    }

    return (
      <path
        className={Styles.selectBox}
        strokeWidth={SELECT_BOX_WIDTH / scale}
        d={toPath(startPosition, endPosition)}
      />
    );
  }

  // 注册选择框启动事件
  registerHook(EVENT_LISTENER_HOOK, {
    onMouseDown(event) {
      // 非左键事件不处理
      if (event.button !== 0) {
        return;
      }

      // 移动图纸模式下不触发
      if (getService(CONFIGURATION_SERVICE).movePainterMode.data) {
        return;
      }

      // 场景互斥
      if (getService(DRAG_SCENE_SERVICE).size !== 0) {
        return;
      }

      // 必须是在画布本身触发
      if ((event.target as HTMLElement).tagName === 'svg') {
        getService(DRAG_SCENE_SERVICE).trigger(SELECT_BOX_DRAG_SCENE_NAME, { event });
      }
    },
  });

  // 注册选择框场景
  registerHook(DRAG_SCENE_HOOK, {
    name: SELECT_BOX_DRAG_SCENE_NAME,
    isEnd(event) {
      // 非左键或者鼠标抬起事件不处理
      if (event.button !== 0 || event.type !== 'mouseup') {
        return false;
      }

      // 当前场景不是鼠标拖动背景场景时不处理
      if (!getService(DRAG_SCENE_SERVICE).onlyHas(SELECT_BOX_DRAG_SCENE_NAME)) {
        return false;
      }

      return true;
    },
    onDragMove(event) {
      end.setData(Point.from(event.positionInDrawer));
    },
    afterStart(startPayload) {
      // 启动后清除选中
      getService(SELECT_SERVICE).clear();
      // 设置启动坐标
      const position = Point.from(startPayload!.event!.positionInDrawer);
      start.setData(position);
      end.setData(position);
    },
    afterEnd(startPayload, endPayload) {
      start.setData(Point.Zero());
      end.setData(Point.Zero());
    },
  });

  // 注册选择框组件
  registerHook(DRAW_LAYER_HOOK, {
    name: 'SelectBoxLayer',
    order: 4,
    Render: memo(SelectBox),
  });

  // 卸载器
  return () => {
    start.unObserve();
    end.unObserve();
  };
});
