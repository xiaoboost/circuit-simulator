import {
  Point,
  Direction,
  rotateVector,
  invertRotateMatrix,
} from '@circuit/algorithm';
import { createPartReferenceTag as createPartTag } from '@circuit/electronics';
import {
  IStreamService,
  ILoggerService,
  IStateCoreService,
} from '@circuit/shared';
import { definePlugin } from '../../../../context';
import {
  IDragSceneService,
  IDragSceneHook,
  ISelectService,
  ICursorService,
  CursorKind,
  IEventListenerHook,
  IVariableObserverService as VarService,
  PainterStreamConstant as Constant,
} from '../../../../types';
import { MOVEMENT_HOC_SCOPE as KEY } from '../algorithm/searcher/constant';
import { getPartNearestDirection } from './utils';

const MoveDragSceneName = 'move-part-label';
const LoggerName = '移动器件信息文本';
const getLabelKey = (id: string) => `${id}-label`;

interface Payload {
  id: string;
}

definePlugin(({ registerHook, getService }) => {
  registerHook(IEventListenerHook, {
    order: 5,
    onMouseUp(event) {
      const dragSceneService = getService(IDragSceneService);
      if (dragSceneService.isLeftMouseUpNoMovingHasScene(event, MoveDragSceneName)) {
        dragSceneService.triggerEnd(MoveDragSceneName, { event });
      }
    },
  });

  registerHook(IDragSceneHook, {
    name: MoveDragSceneName,
    afterStart({ id }: Payload) {
      getService(ILoggerService).info(LoggerName, '开始移动器件信息文本', id);
      // 设置选中
      getService(ISelectService).set(id);
      // 偏移数据清零
      getService(VarService).set(KEY, getLabelKey(id), new Point(0, 0));
      // 设置鼠标指针
      getService(ICursorService).set(CursorKind.Dragging);
    },
    onDragMove({ movementInDrawerAcc }, { id }: Payload) {
      const part = getService(IStateCoreService).getPart(id);
      const varService = getService(VarService);
      const invRotate = invertRotateMatrix(part.rotate);
      const movementInPart = rotateVector(movementInDrawerAcc, invRotate);
      const labelKey = getLabelKey(id);
      varService.set(KEY, labelKey, movementInPart);
    },
    afterEnd({ id }: Payload) {
      const label = getLabelKey(id);
      const painterService = getService(IStateCoreService);
      const stream = getService(IStreamService);
      const variableService = getService(VarService);
      const part = painterService.getPart(id);
      const partTag = createPartTag(part);
      const cursor = getService(ICursorService);
      const logger = getService(ILoggerService);
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
          `移动器件 ${partTag} 文本，`
          + `从 ${Direction[part.textDirection]} 到 ${Direction[newDirection]} 方向`
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
