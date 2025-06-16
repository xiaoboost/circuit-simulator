import { definePlugin, Watcher } from '../../../context';
import { ICursorService, ICursorKind, CURSOR_SERVICE } from '../../../types';

definePlugin(({ registerService }) => {
  const service: ICursorService = {
    value: new Watcher<ICursorKind>(ICursorKind.Default),
    kind: ICursorKind,
    set(kind) {
      this.value.setData(kind);
    },
    clear() {
      this.set(ICursorKind.Default);
    },
  };

  // 注册鼠标指针服务
  registerService(CURSOR_SERVICE, service);

  // 卸载器
  return () => {
    service.value.unObserve();
  };
});
