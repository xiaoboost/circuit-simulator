import { Point, Direction } from '@circuit/algorithm';
import { definePlugin } from '../../../context';
import {
  DRAG_SCENE_SERVICE,
  DRAG_SCENE_HOOK,
  SELECT_SERVICE,
  RENDERER_HOC,
  ELECTRONIC_SERVICE_KEY,
  VARIABLE_OBSERVER_SERVICE as VarService,
} from '../../../types';
import { MOVE_PART_LABEL_HOC_KEY as KEY } from './constant';
import { MovePartLabelHOC } from './hoc';
import { getPartNearestDirection } from './utils';

const MoveDragSceneName = 'move-part-label';

interface Payload {
  id: string;
}

definePlugin(({ registerHook, getService }) => {
  registerHook(DRAG_SCENE_HOOK, {
    name: MoveDragSceneName,
    afterStart({ id }: Payload) {
      // 设置选中
      getService(SELECT_SERVICE).set(id);
      // 偏移数据清零
      getService(VarService).set(KEY, `${id}-label`, new Point(0, 0));
    },
    onDragMove({ movementInDrawerAcc }, { id }: Payload) {
      if (getService(DRAG_SCENE_SERVICE).onlyHas(MoveDragSceneName)) {
        getService(VarService).set(KEY, `${id}-label`, Point.from(movementInDrawerAcc));
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
      const label = `${id}-label`;
      const electronicsService = getService(ELECTRONIC_SERVICE_KEY);
      const variableService = getService(VarService);
      const part = electronicsService.getPart(id);
      const newDirection = getPartNearestDirection(part, variableService.get(KEY, label)!);

      // 方向发生变化，提交修改
      if (newDirection !== part.textDirection) {
        electronicsService.commit({
          name: `移动器件 ${part.id} 文本`,
          description: (
            `移动器件 ${part.id} 文本，` +
            `从 ${Direction[part.textDirection]} 到 ${Direction[newDirection]} 方向`
          ),
          patch: (data) => {
            const part = data.parts.find((p) => p.id === id);

            if (part) {
              part.textDirection = newDirection;
            }
          },
        });
      }

      // 等一帧清空临时状态
      Promise.resolve().then(() => {
        getService(VarService).set(KEY, label, undefined);
      });
    },
  });

  registerHook(RENDERER_HOC, {
    name: 'MovePartLabelHOC',
    order: 9,
    RenderHOC: MovePartLabelHOC,
  });
});
