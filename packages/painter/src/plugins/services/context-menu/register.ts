import { Point } from '@circuit/algorithm';
import { definePlugin, Watcher } from '../../../context';
import { IContextMenuService } from '../../../types';

definePlugin(({ registerService }) => {
  const service: IContextMenuService = {
    visible: new Watcher<boolean>(false),
    position: new Watcher<Point>(new Point(0, 0)),
    openDropdown: new Watcher(''),
    openAt(point: Point) {
      service.visible.setData(true);
      service.position.setData(point);
    },
    close() {
      service.visible.setData(false);
    },
  };

  registerService(IContextMenuService, service);

  return () => {
    service.visible.destroy();
    service.position.destroy();
    service.openDropdown.destroy();
  };
});
