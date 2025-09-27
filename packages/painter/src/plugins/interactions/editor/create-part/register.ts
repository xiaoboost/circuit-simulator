import { Point } from '@circuit/algorithm';
import {
  createPartByKind,
  createPartReferenceTag as createPartTag,
} from '@circuit/electronics';
import {
  ILoggerService,
  IStateCoreService,
  ILifeCycleHook,
  IStreamService,
  GlobalStreamConstant as Constant,
} from '@circuit/shared';
import { PartStructuredData } from '@circuit/types';
import { message } from 'antd';
import { definePlugin } from '../../../../context';
import {
  DragSceneHookPayload,
  IDragSceneHook,
  ISelectService,
  IDragSceneService,
  IMapHashMarkService,
  ICollisionService,
  IVariableObserverService,
  IPainterHTMLElement,
  IPainterConfigurationService,
  IEventListenerHook,
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
    getService(IVariableObserverService).set(KEY, [
      [getBodyKey(id), position],
      [getLabelKey(id), position],
    ]);
  };

  // 全局监听创建的器件
  registerHook(ILifeCycleHook, {
    afterPluginInit() {
      const stateCore = getService(IStateCoreService);
      const logger = getService(ILoggerService);
      const dragScene = getService(IDragSceneService);
      const stream = getService(IStreamService);
      const newPartStream = stream.get<Constant.NewPartPayload>(Constant.NewPart);

      newPartStream.subscribe((payload) => {
        if (!payload) {
          return;
        }

        if (getService(IPainterConfigurationService).movePainterMode.data) {
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

  // 注册创建器件触发器
  registerHook(IEventListenerHook, {
    onMouseUp(event) {
      const dragSceneService = getService(IDragSceneService);
      if (dragSceneService.isLeftMouseUpNoMovingHasScene(event, CreatePartSceneName)) {
        dragSceneService.triggerEnd(CreatePartSceneName, { event });
      }
    },
  });

  // 创建的拖动场景
  registerHook(IDragSceneHook, {
    name: CreatePartSceneName,
    afterStart({ part }: StartPayloadType) {
      // 打印日志
      getService(ILoggerService).info(LoggerName, '开始创建器件', createPartTag(part));
      // 清空选中
      getService(ISelectService).clear();
      // 下一帧时页面焦点设置为画布元素，不直接设置主要是为了规避浏览器事件系统的干扰
      requestAnimationFrame(() => {
        getService(IPainterHTMLElement)?.current?.focus({ preventScroll: true });
      });
    },
    onFirstDragMove({ positionInDrawer }, payload) {
      getService(IStateCoreService).draft((state) => {
        state.parts.push({
          ...payload.part,
          position: Point.from(0),
        });
      });
      setPosition(payload.part.id, positionInDrawer);
    },
    onDragMove({ positionInDrawer }, payload: StartPayloadType) {
      setPosition(payload.part.id, positionInDrawer);
      getService(ILoggerService).debug(LoggerName, '移动创建中的器件', positionInDrawer.join());
    },
    afterEnd({ part }: StartPayloadType, endPayload) {
      const painterService = getService(IStateCoreService);
      const logger = getService(ILoggerService);
      const mapService = getService(IMapHashMarkService);
      const collisionService = getService(ICollisionService);
      const currentPosition = endPayload?.event?.positionInDrawer?.round(20);

      if (!currentPosition) {
        throw new Error('创建器件失败，位置未确定');
      }

      const partTag = createPartTag(part);
      const realBias = collisionService.findNearestNotCollisionPosition({
        ...part,
        position: currentPosition,
      });

      if (!realBias) {
        logger.error(LoggerName, '创建器件失败，位置被占用', partTag);
        return;
      }

      const realPosition = currentPosition.add(realBias);
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
    afterCancel({ part }: StartPayloadType) {
      const painterService = getService(IStateCoreService);
      const logger = getService(ILoggerService);
      logger.info(LoggerName, '取消创建器件', createPartTag(part));
      painterService.dropDraft();
    },
  });
});
