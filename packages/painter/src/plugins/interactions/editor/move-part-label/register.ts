import {
  Point,
  Direction,
  rotateVector,
  invertRotateMatrix,
} from '@circuit/algorithm';
import { createPartReferenceTag as createPartTag } from '@circuit/electronics';
import {
  STREAM_SERVICE,
  LOGGER_SERVICE,
  STATE_CORE_SERVICE,
} from '@circuit/shared';
import { definePlugin } from '../../../../context';
import {
  DRAG_SCENE_SERVICE,
  DRAG_SCENE_HOOK,
  SELECT_SERVICE,
  CURSOR_SERVICE,
  ICursorKind,
  VARIABLE_OBSERVER_SERVICE as VarService,
  PainterStreamConstant as Constant,
} from '../../../../types';
import { MOVEMENT_HOC_SCOPE as KEY } from '../constant';
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
      const part = getService(STATE_CORE_SERVICE).getPart(id);
      const varService = getService(VarService);
      const invRotate = invertRotateMatrix(part.rotate);
      const movementInPart = rotateVector(movementInDrawerAcc, invRotate);
      const labelKey = getLabelKey(id);
      varService.set(KEY, labelKey, movementInPart);
    },
    isEnd(event) {
      return getService(DRAG_SCENE_SERVICE)
        .isLeftMouseUpNoMovingHasScene(event, MoveDragSceneName);
    },
    afterEnd({ id }: Payload) {
      const label = getLabelKey(id);
      const painterService = getService(STATE_CORE_SERVICE);
      const stream = getService(STREAM_SERVICE);
      const variableService = getService(VarService);
      const part = painterService.getPart(id);
      const partTag = createPartTag(part);
      const cursor = getService(CURSOR_SERVICE);
      const logger = getService(LOGGER_SERVICE);
      /** 当前器件标记相对最开始时的偏移向量 */
      const labelPositionInPart = variableService.get<Point>(KEY, label)!;
      /** 偏移向量转为画布向量 */
      const labelPosition = rotateVector(labelPositionInPart, part.rotate);
      /** 由偏移向量计算得到最接近的最终方向 */
      const newDirection = getPartNearestDirection(part, labelPosition);

      cursor.clear();

      // 文本方向未发生变化，清空临时数据
      if (newDirection === part.textDirection) {
        logger.info(LoggerName, `${partTag} 文本方向未发生变化`);
      }
      // 方向发生变化，提交修改
      else {
        const message = (
          `移动器件 ${partTag} 文本，` +
          `从 ${Direction[part.textDirection]} 到 ${Direction[newDirection]} 方向`
        );

        painterService.commit({
          name: `移动器件 ${partTag} 文本`,
          description: message,
          patch: (data) => {
            const part = data.parts.find((p) => p.id === id);

            if (part) {
              part.textDirection = newDirection;
            }
          },
        });

        logger.info(LoggerName, message);

        // 等待器件文本修改时，一起提交
        stream
          .get<Constant.PartLabelChangedPayload>(Constant.PartLabelChanged)
          .once((payload) => payload?.id === part.id)
          .then(() => variableService.set(KEY, label, undefined));
      }
    },
  });
});
