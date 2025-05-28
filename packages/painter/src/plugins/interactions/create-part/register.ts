import { Point } from '@circuit/algorithm';
import { NewElectronicPosition, PartStructuredData } from '@circuit/electronics';
import { definePlugin, Watcher } from '../../../context';
import {
  ICursorService,
  DRAG_SCENE_HOOK,
  LIFE_CYCLE_HOOK,
  SELECT_SERVICE,
  PAINTER_SERVICE_KEY,
  DRAG_SCENE_SERVICE,
  EVENT_BUS_KEY,
  VARIABLE_OBSERVER_SERVICE as VarService,
} from '../../../types';
import { MOVEMENT_HOC_KEY as KEY } from '../movement/constant';

const CreatePartSceneName = 'create-part';
const getBodyKey = (id: string) => `${id}-body`;
const getLabelKey = (id: string) => `${id}-label`;

type PayloadType = PartStructuredData;

definePlugin(({ registerHook, getService }) => {
  const setPosition = (id: string, position: Point) => {
    getService(VarService).set(KEY, [
      [getBodyKey(id), position],
      [getLabelKey(id), position],
    ]);
  };

  registerHook(LIFE_CYCLE_HOOK, {
    afterPluginInit() {
      const { parts } = getService(PAINTER_SERVICE_KEY);
      const service = getService(DRAG_SCENE_SERVICE);

      parts.observe((state) => {
        const newPart = state.find((part) => NewElectronicPosition.isEqual(part.position));

        if (newPart && service.size === 0) {
          service.trigger(CreatePartSceneName, newPart);
        }
      });
    },
  });

  registerHook(DRAG_SCENE_HOOK, {
    name: CreatePartSceneName,
    afterStart({ id, position }: PayloadType) {
      // 清空选中
      getService(SELECT_SERVICE).clear();
      // 设置偏移
      setPosition(id, Point.from(position));
    },
    onDragMove({ positionInDrawer }, { id }: PayloadType) {
      if (getService(DRAG_SCENE_SERVICE).onlyHas(CreatePartSceneName)) {
        setPosition(id, Point.from(positionInDrawer));
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
    afterEnd(part: PayloadType) {
      const label = getLabelKey(part.id);
      const painterService = getService(PAINTER_SERVICE_KEY);
      const eventBus = getService(EVENT_BUS_KEY);
      const variableService = getService(VarService);
      // const part = painterService.getPart(id);
      // const newDirection = getPartNearestDirection(part, variableService.get(KEY, label)!);
    },
  });
});
