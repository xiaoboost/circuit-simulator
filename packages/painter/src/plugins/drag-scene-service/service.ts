import { definePlugin } from '../../context';
import { IDragSceneService } from '../../types';
import { DRAG_SCENE_SERVICE } from './constant';

definePlugin(({ registerService }) => {
  const scenes: string[] = [];
  const service: IDragSceneService = {
    get scenes() {
      return scenes.slice() as readonly string[];
    },
    get isEmpty() {
      return scenes.length === 0;
    },
    addScene(scene: string) {
      if (!scenes.includes(scene)) {
        scenes.push(scene);
      }
    },
    removeScene(scene: string) {
      const index = scenes.indexOf(scene);
      if (index !== -1) {
        scenes.splice(index, 1);
      }
    },
  };

  // 注册鼠标拖动服务
  registerService(DRAG_SCENE_SERVICE, service);
});
