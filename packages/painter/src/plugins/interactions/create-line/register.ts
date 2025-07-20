import { Point } from '@circuit/algorithm';
import { createPartByKind } from '@circuit/electronics';
import {
  LOGGER_SERVICE,
  CONFIGURATION_SERVICE,
  STATE_CORE_SERVICE,
  HOT_KEY_HOOK,
  LIFE_CYCLE_HOOK,
  STREAM_SERVICE,
  GlobalStreamConstant as Constant,
} from '@circuit/shared';
import { EntityKind } from '@circuit/types';
import { message } from 'antd';
import { definePlugin } from '../../../context';
import {
  DragSceneHookPayload,
  EVENT_LISTENER_HOOK,
  HOVER_SERVICE,
  DRAG_SCENE_HOOK,
  SELECT_SERVICE,
  DRAG_SCENE_SERVICE,
  MAP_HASH_SERVICE,
  COLLISION_SERVICE,
  VARIABLE_OBSERVER_SERVICE,
  PAINTER_HTML_ELEMENT,
} from '../../../types';

const CreateLineSceneName = 'create-line';
const LoggerName = '创建导线';

interface StartPayloadType extends DragSceneHookPayload {
  /** 绘制导线时点击编号 */
  partId: string;
  /** 元件引脚索引 */
  partPinIndex: number;
  /** 是否已经拖动模式 */
  afterDraft: boolean;
}

interface EndPayloadType extends DragSceneHookPayload {
  esc: true;
}

definePlugin(({ registerHook, getService }) => {
  // 注册创建导线的拖动场景
  registerHook(EVENT_LISTENER_HOOK, {
    order: 9,
    onMouseDown(event) {
      // 非左键不处理
      if (event.button !== 0) {
        return;
      }

      const dragSceneService = getService(DRAG_SCENE_SERVICE);
      const hoverService = getService(HOVER_SERVICE);
      const hover = hoverService.status.data;

      if (
        // 没有悬停
        !hover ||
        // 悬停的不是空器件引脚
        hover.kind !== EntityKind.PartPin ||
        // 正在拖动
        dragSceneService.isDragging()
      ) {
        return;
      }

      debugger;
    },
  });

  // 键盘按下`Esc`时取消创建
  registerHook(HOT_KEY_HOOK, {
    key: 'esc',
    name: '取消创建器件',
    action: () => {
      const service = getService(DRAG_SCENE_SERVICE);

      // 当前正在创建器件，则取消创建
      if (service.has(CreateLineSceneName)) {
        service.triggerEnd(CreateLineSceneName, { esc: true });
      }
    },
  });

  // 创建的拖动场景
  registerHook(DRAG_SCENE_HOOK, {
    name: CreateLineSceneName,
    afterStart({ part }: StartPayloadType) {
      // 打印日志
      getService(LOGGER_SERVICE).info(LoggerName, '开始创建导线', part.id);
      // 清空选中
      getService(SELECT_SERVICE).clear();
    },
    onDragMove({ positionInDrawer }, payload: StartPayloadType) {
      // if (!payload.afterDraft) {
      //   getService(STATE_CORE_SERVICE).draft((state) => {
      //     state.parts.push({
      //       ...payload.part,
      //       position: Point.from([0, 0]),
      //     });
      //   });
      //   payload.afterDraft = true;
      // }
      // else if (getService(DRAG_SCENE_SERVICE).onlyHas(CreatePartSceneName)) {
      //   setPosition(payload.part.id, positionInDrawer);
      //   getService(LOGGER_SERVICE).debug(LoggerName, '移动创建中的器件', positionInDrawer.join());
      // }
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
    afterEnd({ part }: StartPayloadType, endPayload: EndPayloadType) {
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
