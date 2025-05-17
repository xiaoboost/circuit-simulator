import { Point } from '@circuit/algorithm';
import { definePlugin } from '../../../context';
import {
  LOGGER_SERVICE,
  DRAG_SCENE_SERVICE,
  DRAG_SCENE_HOOK,
  SELECT_SERVICE,
  VARIABLE_OBSERVER_SERVICE as VarService,
} from '../../../types';
import { MOVE_HOC_KEY } from '../movement-hoc/constant';

const MoveDragSceneName = 'move-part-label';

interface Payload {
  id: string;
}

definePlugin(({ registerHook, getService }) => {
  registerHook(DRAG_SCENE_HOOK, {
    name: MoveDragSceneName,
    afterStart({ id }: Payload) {
      debugger;
      // 设置选中
      getService(SELECT_SERVICE).set(id);
      // 偏移数据清零
      getService(VarService).set(MOVE_HOC_KEY, `${id}-label`, new Point(0, 0));
    },
    onDragMove({ movement }, { id }: Payload) {
      if (getService(DRAG_SCENE_SERVICE).onlyHas(MoveDragSceneName)) {
        debugger;
        getService(VarService).set(MOVE_HOC_KEY, `${id}-label`, Point.from(movement));
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

      debugger;
      return true;
    },
    afterEnd(payload: Payload) {

    },
  });
});
