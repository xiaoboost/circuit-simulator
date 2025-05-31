import { Point } from '@circuit/algorithm';
import { NewElectronicPosition, PartStructuredData } from '@circuit/electronics';
import { definePlugin, Watcher } from '../../../context';
import {
  ICursorService,
  HOT_KEY_HOOK,
  DRAG_SCENE_HOOK,
  LIFE_CYCLE_HOOK,
  SELECT_SERVICE,
  PAINTER_SERVICE,
  DRAG_SCENE_SERVICE,
  LOGGER_SERVICE,
  DragSceneHookPayload,
  VARIABLE_OBSERVER_SERVICE,
} from '../../../types';
import { MOVEMENT_HOC_KEY as KEY } from '../movement/constant';

const CreatePartSceneName = 'create-part';
const LoggerName = '创建器件';
const getBodyKey = (id: string) => `${id}-body`;
const getLabelKey = (id: string) => `${id}-label`;

type StartPayloadType = PartStructuredData & DragSceneHookPayload;
type EndPayloadType = { esc: true } & DragSceneHookPayload;

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
      const { parts } = getService(PAINTER_SERVICE);
      const service = getService(DRAG_SCENE_SERVICE);

      parts.observe((state) => {
        const newPart = state.find((part) => NewElectronicPosition.isEqual(part.position));

        if (newPart && service.size === 0) {
          service.trigger(CreatePartSceneName, newPart);
        }
      });
    },
  });

  // 键盘按下`Esc`时取消创建
  registerHook(HOT_KEY_HOOK, {
    key: 'esc',
    name: '取消创建器件',
    action: () => {
      const service = getService(DRAG_SCENE_SERVICE);

      // 当前正在创建器件，则取消创建
      if (service.has(CreatePartSceneName)) {
        service.triggerEnd(CreatePartSceneName, { esc: true });
      }
    },
  });

  // 创建的拖动场景
  registerHook(DRAG_SCENE_HOOK, {
    name: CreatePartSceneName,
    afterStart({ id, position }: StartPayloadType) {
      // 打印日志
      getService(LOGGER_SERVICE).info(LoggerName, '开始创建器件', id);
      // 清空选中
      getService(SELECT_SERVICE).clear();
      // 设置偏移
      setPosition(id, Point.from(position));
    },
    onDragMove({ positionInDrawer }, { id }: StartPayloadType) {
      if (getService(DRAG_SCENE_SERVICE).onlyHas(CreatePartSceneName)) {
        setPosition(id, NewElectronicPosition.mul(-1).add(positionInDrawer));
        getService(LOGGER_SERVICE).debug(LoggerName, '移动创建中的器件', positionInDrawer.join());
      }
    },
    isEnd(event) {
      // 非左键或者鼠标抬起事件不处理
      if (event.button !== 0 || event.type !== 'mouseup') {
        return false;
      }

      // 当前场景不是鼠标拖动背景场景时不处理
      if (!getService(DRAG_SCENE_SERVICE).onlyHas(CreatePartSceneName)) {
        return false;
      }

      return true;
    },
    afterEnd(part: StartPayloadType, endPayload: EndPayloadType) {
      const painterService = getService(PAINTER_SERVICE);
      const logger = getService(LOGGER_SERVICE);

      if (endPayload?.esc) {
        logger.info(LoggerName, '取消创建器件', part.id);
        painterService.dropDraft();
        return;
      }

      const currentPosition = endPayload.event!.positionInDrawer.round(20);

      painterService.commit({
        name: `创建器件 ${part.id}`,
        description: `创建器件 ${part.id}，位置：${currentPosition.join()}`,
        patch({ parts }) {
          parts.push({
            ...part,
            position: currentPosition.toData(),
          });
        },
      });

      // 清除临时变量
      setPosition(part.id, undefined);
      logger.info(LoggerName, '结束创建器件', part.id);
    },
  });
});
