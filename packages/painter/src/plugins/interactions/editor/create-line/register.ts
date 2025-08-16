import { Point } from '@circuit/algorithm';
import { createLine, getPartPin, createPartReferenceTag } from '@circuit/electronics';
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
  EntityKind,
  CONNECTION_SERVICE,
  CURSOR_SERVICE,
  ICursorKind,
  VARIABLE_OBSERVER_SERVICE,
} from '../../../../types';
import { PathSearcher } from '../algorithm';
import { PIN_DRAW_FIXED_STYLE } from '../constant';
import { painterStateGetter, createSearchHook, setSearchResult } from '../utils';
import { CreateLineSceneName, LoggerName } from './constant';
import { createDrawLineSearcher as createSearcher } from './search';

interface StartPayloadType extends DragSceneHookPayload {
  /** 新导线 */
  line: LineStructuredData;
  /** 创建状态 */
  start: {
    /** 元件编号 */
    id: string;
    /** 元件引脚 */
    pin: number;
    /** 元件引用编号 */
    tag: string;
  };
  /** 搜索器 */
  search: PathSearcher;
}

definePlugin(({ registerHook, getService }) => {
  // 注册创建导线场景
  registerHook(EVENT_LISTENER_HOOK, {
    order: 5,
    onMouseDown(event) {
      const dragSceneService = getService(DRAG_SCENE_SERVICE);
      const hoverService = getService(HOVER_SERVICE);
      const hover = hoverService.status.data;

      if (
        !dragSceneService.isLeftMouseDownNoMovingNoScene(event) ||
        (
          !hover ||
          hover.kind !== EntityKind.PartPin
        )
      ) {
        return;
      }

      const state = getService(STATE_CORE_SERVICE);
      const connection = getService(CONNECTION_SERVICE);
      const part = state.getPart(hover.id);
      const pin = getPartPin(part, hover.pin);
      const line = createLine(pin.position);
      const search = createSearcher({
        lineId: line.id,
        start: pin.position,
        direction: pin.direction,
        map: getService(MAP_HASH_SERVICE).getMap(),
        painter: painterStateGetter(hoverService, state, connection),
        hook: createSearchHook(getService(VARIABLE_OBSERVER_SERVICE)),
      });

      // 创建导线草稿
      state.draft(({ lines }) => {
        lines.push(line);
      });

      // 触发创建导线事件
      dragSceneService.trigger(CreateLineSceneName, {
        line,
        search,
        event,
        start: {
          id: hover.id,
          pin: hover.pin,
          tag: createPartReferenceTag(part),
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

      const varService = getService(VARIABLE_OBSERVER_SERVICE);

      // 打印日志
      logger.info(
        LoggerName,
        '开始创建导线',
        `从器件 ${start.tag} 第 ${start.pin} 引脚开始`,
        `新导线编号 ${line.id}`,
      );
      // 选中导线
      getService(SELECT_SERVICE).set(line.id);
      // 设置鼠标样式
      getService(CURSOR_SERVICE).set(ICursorKind.DrawLine);
      // 初始化导线路径
      setSearchResult(varService, search(event.positionInDrawer));
      // 设置初始化样式
      setSearchResult(varService, [
        {
          id: start.id,
          pin: start.pin,
          style: PIN_DRAW_FIXED_STYLE,
        },
        {
          id: line.id,
          pin: 0,
          style: PIN_DRAW_FIXED_STYLE,
        },
      ]);
    },
    onDragMove({ positionInDrawer, movement }, { search }: StartPayloadType) {
      setSearchResult(getService(VARIABLE_OBSERVER_SERVICE), search(positionInDrawer, movement));
    },
    isEnd(event) {
      return getService(DRAG_SCENE_SERVICE)
        .isLeftMouseUpNoMovingHasScene(event, CreateLineSceneName);
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
