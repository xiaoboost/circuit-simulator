import { Point, Direction } from '@circuit/algorithm';
import {
  STREAM_SERVICE,
  LOGGER_SERVICE,
  STATE_CORE_SERVICE,
} from '@circuit/shared';
import { definePlugin } from '../../../context';
import {
  DRAG_SCENE_SERVICE,
  DRAG_SCENE_HOOK,
  SELECT_SERVICE,
  CURSOR_SERVICE,
  ICursorKind,
  VARIABLE_OBSERVER_SERVICE as VarService,
  PainterStreamConstant as Constant,
} from '../../../types';
import { MOVEMENT_HOC_SCOPE as KEY } from '../../hoc-modules';
import { getPartNearestDirection } from './utils';

const MoveDragSceneName = 'move-part-label';
const LoggerName = '移动器件信息文本';
const getLabelKey = (id: string) => `${id}-label`;

interface Payload {
  id: string;
}

definePlugin(({ registerHook, getService }) => {
  registerHook(DRAG_SCENE_HOOK, {
    name: MoveDragSceneName,
    afterStart({ id }: Payload) {
      getService(LOGGER_SERVICE).info(LoggerName, '开始移动器件信息文本', id);
      // 设置选中
      getService(SELECT_SERVICE).set(id);
      // 偏移数据清零
      getService(VarService).set(KEY, getLabelKey(id), new Point(0, 0));
      // 设置鼠标指针
      getService(CURSOR_SERVICE).set(ICursorKind.Dragging);
    },
    onDragMove({ movementInDrawerAcc }, { id }: Payload) {
      if (getService(DRAG_SCENE_SERVICE).onlyHas(MoveDragSceneName)) {
        getService(VarService).set(KEY, getLabelKey(id), Point.from(movementInDrawerAcc));
      }
    },
    isEnd(event) {
      // 非左键或者鼠标抬起事件不处理
      if (event.button !== 0 || event.type !== 'mouseup') {
        return false;
      }

      // 当前场景不是鼠标拖动背景场景时不处理
      if (!getService(DRAG_SCENE_SERVICE).onlyHas(MoveDragSceneName)) {
        return false;
      }

      return true;
    },
    afterEnd({ id }: Payload) {
      const label = getLabelKey(id);
      const painterService = getService(STATE_CORE_SERVICE);
      const stream = getService(STREAM_SERVICE);
      const variableService = getService(VarService);
      const part = painterService.getPart(id);
      const cursor = getService(CURSOR_SERVICE);
      const newDirection = getPartNearestDirection(part, variableService.get(KEY, label)!);

      cursor.clear();

      // 文本方向未发生变化，清空临时数据
      if (newDirection === part.textDirection) {
        variableService.set(KEY, label, undefined);
        getService(LOGGER_SERVICE).info(LoggerName, '文本方向未发生变化', id);
      }
      // 方向发生变化，提交修改
      else {
        const message = (
          `移动器件 ${part.id} 文本，` +
          `从 ${Direction[part.textDirection]} 到 ${Direction[newDirection]} 方向`
        );

        painterService.commit({
          name: `移动器件 ${part.id} 文本`,
          description: message,
          patch: (data) => {
            const part = data.parts.find((p) => p.id === id);

            if (part) {
              part.textDirection = newDirection;
            }
          },
        });

        getService(LOGGER_SERVICE).info(LoggerName, message);

        // 等待器件文本修改时，一起提交
        stream
          .get<Constant.PartLabelChangedPayload>(Constant.PartLabelChanged)
          .once(() => variableService.set(KEY, label, undefined));
      }
    },
  });
});
