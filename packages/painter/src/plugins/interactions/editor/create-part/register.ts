import { Point } from '@circuit/algorithm';
import {
  createPartByKind,
  createPartReferenceTag as createPartTag,
} from '@circuit/electronics';
import {
  LOGGER_SERVICE,
  STATE_CORE_SERVICE,
  LIFE_CYCLE_HOOK,
  STREAM_SERVICE,
  GlobalStreamConstant as Constant,
} from '@circuit/shared';
import { PartStructuredData } from '@circuit/types';
import { message } from 'antd';
import { definePlugin } from '../../../../context';
import {
  DragSceneHookPayload,
  DRAG_SCENE_HOOK,
  SELECT_SERVICE,
  DRAG_SCENE_SERVICE,
  MAP_HASH_SERVICE,
  COLLISION_SERVICE,
  VARIABLE_OBSERVER_SERVICE,
  PAINTER_HTML_ELEMENT,
  PAINTER_CONFIGURATION_SERVICE,
} from '../../../../types';
import { MOVEMENT_HOC_SCOPE as KEY } from '../constant';

const CreatePartSceneName = 'create-part';
const LoggerName = '创建器件';
const getBodyKey = (id: string) => `${id}-body`;
const getLabelKey = (id: string) => `${id}-label`;

interface StartPayloadType extends DragSceneHookPayload {
  part: PartStructuredData;
}

definePlugin(({ registerHook, getService }) => {
  const setPosition = (id: string, position?: Point) => {
    getService(VARIABLE_OBSERVER_SERVICE).set(KEY, [
      [getBodyKey(id), position],
      [getLabelKey(id), position],
    ]);
  };

  // 全局监听创建的器件
  registerHook(LIFE_CYCLE_HOOK, {
    afterPluginInit() {
      const stateCore = getService(STATE_CORE_SERVICE);
      const logger = getService(LOGGER_SERVICE);
      const dragScene = getService(DRAG_SCENE_SERVICE);
      const stream = getService(STREAM_SERVICE);
      const newPartStream = stream.get<Constant.NewPartPayload>(Constant.NewPart);

      newPartStream.subscribe((payload) => {
        if (!payload) {
          return;
        }

        if (getService(PAINTER_CONFIGURATION_SERVICE).movePainterMode.data) {
          const msg = '移动图纸模式下不能创建器件';
          logger.info(LoggerName, msg);
          message.warning(msg);
          return;
        }

        const newPart = createPartByKind(payload.kind, stateCore.state.data.parts);

        if (!dragScene.isDragging.data) {
          dragScene.trigger(CreatePartSceneName, {
            part: newPart,
          });
        }
      });
    },
  });

  // 创建的拖动场景
  registerHook(DRAG_SCENE_HOOK, {
    name: CreatePartSceneName,
    afterStart({ part }: StartPayloadType) {
      // 打印日志
      getService(LOGGER_SERVICE).info(LoggerName, '开始创建器件', createPartTag(part));
      // 清空选中
      getService(SELECT_SERVICE).clear();
      // 下一帧时页面焦点设置为画布元素，不直接设置主要是为了规避浏览器事件系统的干扰
      requestAnimationFrame(() => {
        getService(PAINTER_HTML_ELEMENT)?.current?.focus({ preventScroll: true });
      });
    },
    onFirstDragMove({ positionInDrawer }, payload) {
      getService(STATE_CORE_SERVICE).draft((state) => {
        state.parts.push({
          ...payload.part,
          position: Point.from(positionInDrawer),
        });
      });
    },
    onDragMove({ positionInDrawer }, payload: StartPayloadType) {
      if (getService(DRAG_SCENE_SERVICE).onlyHas(CreatePartSceneName)) {
        setPosition(payload.part.id, positionInDrawer);
        getService(LOGGER_SERVICE).debug(LoggerName, '移动创建中的器件', positionInDrawer.join());
      }
    },
    isEnd(event) {
      return getService(DRAG_SCENE_SERVICE)
        .isLeftMouseUpNoMovingHasScene(event, CreatePartSceneName);
    },
    afterEnd({ part }: StartPayloadType, endPayload) {
      const painterService = getService(STATE_CORE_SERVICE);
      const logger = getService(LOGGER_SERVICE);
      const mapService = getService(MAP_HASH_SERVICE);
      const collisionService = getService(COLLISION_SERVICE);
      const currentPosition = endPayload?.event?.positionInDrawer?.round(20);

      if (!currentPosition) {
        throw new Error('创建器件失败，位置未确定');
      }

      const partTag = createPartTag(part);
      const realPosition = collisionService.findNearestAvailablePosition({
        ...part,
        position: currentPosition,
      });

      if (!realPosition) {
        logger.error(LoggerName, '创建器件失败，位置被占用', partTag);
        return;
      }

      const newPart = {
        ...part,
        position: realPosition,
      };

      painterService.commit({
        name: `创建器件 ${partTag}`,
        description: `创建器件 ${partTag}，位置：${realPosition.join()}`,
        patch({ parts }) {
          parts.push(newPart);
        },
      });

      setPosition(part.id, undefined);
      mapService.setPartMark(newPart);
      collisionService.setEntity(newPart);
      logger.info(LoggerName, '结束创建器件', partTag);
    },
    onCancel({ part }: StartPayloadType) {
      const painterService = getService(STATE_CORE_SERVICE);
      const logger = getService(LOGGER_SERVICE);
      logger.info(LoggerName, '取消创建器件', createPartTag(part));
      painterService.dropDraft();
    },
  });
});
