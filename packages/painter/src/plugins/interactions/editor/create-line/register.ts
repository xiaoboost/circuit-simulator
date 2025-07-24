import { Point } from '@circuit/algorithm';
import { createLine, getPartPin } from '@circuit/electronics';
import {
  LOGGER_SERVICE,
  STATE_CORE_SERVICE,
} from '@circuit/shared';
import { LineStructuredData } from '@circuit/types';
import { definePlugin } from '../../../../context';
import {
  DragSceneHookPayload,
  EVENT_LISTENER_HOOK,
  HOVER_SERVICE,
  DRAG_SCENE_HOOK,
  SELECT_SERVICE,
  DRAG_SCENE_SERVICE,
  MAP_HASH_SERVICE,
  VARIABLE_OBSERVER_SERVICE,
  EntityKind,
  EntityPartPin,
  PAINTER_CONFIGURATION_SERVICE as CONFIGURATION,
} from '../../../../types';
import { PathSearcher } from '../algorithm';
import { PATH_DISTORTION_HOC_SCOPE as KEY } from '../constant';
import { createPainterController, createSearchHook } from '../utils';
import { CreateLineSceneName, LoggerName } from './constant';
import { createDrawLineSearcher as createSearcher } from './search';

interface StartPayloadType extends DragSceneHookPayload {
  /** 新导线 */
  line: LineStructuredData;
  /** 创建状态 */
  start: EntityPartPin;
  /** 搜索器 */
  search: PathSearcher;
}

definePlugin(({ registerHook, getService }) => {
  const setPath = (id: string, path: Point[]) => {
    const VarService = getService(VARIABLE_OBSERVER_SERVICE);
    VarService.set(KEY, `${id}-path`, path);
    VarService.set(KEY, `${id}-pin`, path);
  };

  // 注册创建导线场景
  registerHook(EVENT_LISTENER_HOOK, {
    order: 5,
    onMouseDown(event) {
      // 非左键不处理
      if (event.button !== 0) {
        return;
      }

      const dragSceneService = getService(DRAG_SCENE_SERVICE);
      const hoverService = getService(HOVER_SERVICE);
      const state = getService(STATE_CORE_SERVICE);
      const configuration = getService(CONFIGURATION);
      const hover = hoverService.status.data;

      if (
        // 没有悬停
        !hover ||
        // 悬停的不是引脚
        hover.kind !== EntityKind.PartPin ||
        // 移动模式
        configuration.movePainterMode.data ||
        // 正在拖动
        dragSceneService.isDragging()
      ) {
        return;
      }

      const part = state.getPart(hover.id);
      const pin = getPartPin(part, hover.pin);
      const line = createLine(pin.position);
      const search = createSearcher({
        start: pin.position,
        direction: pin.direction,
        map: getService(MAP_HASH_SERVICE).getMap(),
        painter: createPainterController(getService),
        hook: createSearchHook(getService),
      });

      // 创建导线草稿
      state.draft(({ lines }) => {
        lines.push(line);
      });

      // 触发创建导线事件
      dragSceneService.trigger(CreateLineSceneName, {
        line,
        search,
        start: {
          ...hover,
        },
      });
    },
  });

  // 创建的拖动场景
  registerHook(DRAG_SCENE_HOOK, {
    name: CreateLineSceneName,
    afterStart({ line, start, search, event }: StartPayloadType) {
      const logger = getService(LOGGER_SERVICE);

      if (!event) {
        const msg = '创建导线事件触发时，必须传入鼠标事件';
        logger.error(LoggerName, msg);
        throw new Error(msg);
      }

      // 打印日志
      logger.info(
        LoggerName,
        '开始创建导线',
        `从器件 ${start.id} 第 ${start.pin} 引脚开始`,
        `新导线编号 ${line.id}`,
      );
      // 选中导线
      getService(SELECT_SERVICE).set(line.id);
      // 初始化导线路径
      setPath(line.id, search(event.positionInDrawer));
    },
    onDragMove({ positionInDrawer, movement }, { line, search }: StartPayloadType) {
      setPath(line.id, search(positionInDrawer, movement));
      getService(LOGGER_SERVICE).debug(LoggerName, '创建中的导线', positionInDrawer.join());
    },
    isEnd(event) {
      // 非左键或者鼠标抬起事件不处理
      if (event.button !== 0 || event.type !== 'mouseup') {
        return false;
      }

      // 当前场景不是鼠标拖动背景场景时不处理
      if (!getService(DRAG_SCENE_SERVICE).onlyHas(CreateLineSceneName)) {
        return false;
      }

      return true;
    },
    afterEnd({ line }: StartPayloadType) {
      // const painterService = getService(STATE_CORE_SERVICE);
      // const logger = getService(LOGGER_SERVICE);

      // if (endPayload?.esc) {
      //   logger.info(LoggerName, '取消创建器件', part.id);
      //   painterService.dropDraft();
      //   return;
      // }

      // const mapService = getService(MAP_HASH_SERVICE);
      // const collisionService = getService(COLLISION_SERVICE);
      // const currentPosition = endPayload.event!.positionInDrawer.round(20);
      // const realPosition = collisionService.findNearestAvailablePosition({
      //   ...part,
      //   position: currentPosition,
      // });

      // if (!realPosition) {
      //   logger.error(LoggerName, '创建器件失败，位置被占用', part.id);
      //   return;
      // }

      // const newPart = {
      //   ...part,
      //   position: realPosition,
      // };

      // painterService.commit({
      //   name: `创建器件 ${part.id}`,
      //   description: `创建器件 ${part.id}，位置：${realPosition.join()}`,
      //   patch({ parts }) {
      //     parts.push(newPart);
      //   },
      // });

      // setPosition(part.id, undefined);
      // mapService.setPartMark(newPart);
      // collisionService.setEntity(newPart);
      // logger.info(LoggerName, '结束创建器件', part.id);
    },
  });
});
