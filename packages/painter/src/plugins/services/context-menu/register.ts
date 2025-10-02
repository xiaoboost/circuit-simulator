import { Point } from '@circuit/algorithm';
import { definePlugin, Watcher } from '../../../context';
import { IContextMenuService } from '../../../types';

definePlugin(({ registerService }) => {
  const visible = new Watcher<boolean>(false);
  const position = new Watcher<Point>(new Point(0, 0));

  const service: IContextMenuService = {
    visible,
    position,
    openAt(point: Point) {
      visible.setData(true);
      position.setData(point);
    },
    close() {
      visible.setData(false);
    },
  };

  registerService(IContextMenuService, service);

  return () => {
    visible.destroy();
    position.destroy();
  };
});
