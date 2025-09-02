import { Point } from '@circuit/algorithm';
import {
  LOGGER_SERVICE,
  STATE_CORE_SERVICE,
} from '@circuit/shared';
import React, { memo } from 'react';
import {
  Watcher,
  definePlugin,
  useWatcher,
  useService,
} from '../../../context';
import {
  DRAW_LAYER_HOOK,
  MAP_COORDINATE_SERVICE,
  DRAG_SCENE_HOOK,
  DRAG_SCENE_SERVICE,
  SELECT_SERVICE,
  EVENT_LISTENER_HOOK,
  COLLISION_SERVICE,
  CURSOR_SERVICE,
  ICursorKind,
  HOVER_SERVICE,
} from '../../../types';
import {
  SELECT_BOX_WIDTH,
  SELECT_BOX_MIN_MOVE_DISTANCE,
  SELECT_BOX_DRAG_SCENE_NAME,
} from './constant';
import * as Styles from './styles.less';
import { toPath } from './utils';

const LoggerName = '多选框';

definePlugin(({ registerHook, getService }) => {
  /** 起点坐标 */
  const start = new Watcher<Point>(Point.from(0));
  /** 终点坐标 */
  const end = new Watcher<Point>(Point.from(0));

  // 选择框组件
  function SelectBox() {
    const [scale] = useWatcher(useService(MAP_COORDINATE_SERVICE).scale);
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
      const dragSceneService = getService(DRAG_SCENE_SERVICE);
      const hoverService = getService(HOVER_SERVICE);

      if (
        // 没有悬停实体
        !hoverService.status.data
        // 拖动服务判断可以启动
        && dragSceneService.isLeftMouseDownNoMovingNoScene(event)
        // 鼠标在画布上
        && (event.target as HTMLElement).tagName === 'svg'
      ) {
        dragSceneService.trigger(SELECT_BOX_DRAG_SCENE_NAME, { event });
      }
    },
  });

  // 注册选择框场景
  registerHook(DRAG_SCENE_HOOK, {
    name: SELECT_BOX_DRAG_SCENE_NAME,
    isEnd(event) {
      return getService(DRAG_SCENE_SERVICE)
        .isLeftMouseUpNoMovingHasScene(event, SELECT_BOX_DRAG_SCENE_NAME);
    },
    onDragMove(event) {
      end.setData(Point.from(event.positionInDrawer));

      if (start.data.distance(end.data) > SELECT_BOX_MIN_MOVE_DISTANCE) {
        getService(CURSOR_SERVICE).set(ICursorKind.SelectBox);
      }
    },
    afterStart(startPayload) {
      // 打印日志
      getService(LOGGER_SERVICE).debug(LoggerName, '开始多选框选择');
      // 启动后清除选中
      getService(SELECT_SERVICE).clear();
      // 设置启动坐标
      const position = Point.from(startPayload!.event!.positionInDrawer);
      start.setData(position);
      end.setData(position);
    },
    afterEnd(startPayload, endPayload) {
      if (!startPayload?.event || !endPayload?.event) {
        throw new Error('选择框事件中没有位置信息，请检查代码逻辑是否正常');
      }

      const logger = getService(LOGGER_SERVICE);
      const cursorService = getService(CURSOR_SERVICE);
      const { positionInDrawer: startPosition } = startPayload.event;
      const { positionInDrawer: endPosition } = endPayload.event;

      // 取消多选框图标
      cursorService.clear();

      if (startPosition.distance(endPosition) < SELECT_BOX_MIN_MOVE_DISTANCE) {
        logger.debug(LoggerName, '选择距离小于最小移动距离，不进行选择');
        return;
      }

      const painterService = getService(STATE_CORE_SERVICE);
      const { state: { data: { parts, lines } } } = painterService;
      const selectService = getService(SELECT_SERVICE);
      const collisionService = getService(COLLISION_SERVICE);
      const ids = collisionService.getElectronicsInRect({
        x: Math.min(startPosition[0], endPosition[0]),
        y: Math.min(startPosition[1], endPosition[1]),
        width: Math.abs(startPosition[0] - endPosition[0]),
        height: Math.abs(startPosition[1] - endPosition[1]),
      });
      const partIds = parts
        .map(({ id }) => id)
        .filter((id) => ids.has(id));
      const lineIds = lines
        .map(({ id }) => id)
        .filter((id) => ids.has(id));

      logger.debug(LoggerName, '多选框选择结束');

      start.setData(Point.Zero());
      end.setData(Point.Zero());
      selectService.set(...partIds, ...lineIds);
    },
    onCancel() {
      getService(CURSOR_SERVICE).clear();
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
    start.destroy();
    end.destroy();
  };
});
