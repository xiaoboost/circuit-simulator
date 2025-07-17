import { Point } from '@circuit/algorithm';
import { definePlugin, Watcher } from '../../../context';
import {
  HoverKind,
  HoverStatus,
  IHoverService,
  HOVER_SERVICE,
  EVENT_LISTENER_HOOK,
  MAP_COORDINATE_SERVICE,
  COLLISION_SERVICE,
} from '../../../types';

definePlugin(({ registerService, registerHook, getService }) => {
  const service: IHoverService = {
    status: new Watcher<HoverStatus | undefined>(undefined),
  };

  registerHook(EVENT_LISTENER_HOOK, {
    order: 1,
    onMouseMove(event) {
      const collisionService = getService(COLLISION_SERVICE);
      const mapService = getService(MAP_COORDINATE_SERVICE);
      const positionInDrawer = mapService.screenToMapPosition(new Point(event.pageX, event.pageY));
      const collision = collisionService.pointInEntities(positionInDrawer);

      if (!collision.length) {
        service.status.setData(undefined);
        return;
      }

      debugger;
      const entity = collision[0];
    },
  });

  // 注册鼠标悬停服务
  registerService(HOVER_SERVICE, service);

  return () => {
    service.status.destroy();
  };
});
