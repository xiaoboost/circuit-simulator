import { definePlugin } from '../../../context';
import { SELECT_SERVICE, ISelectService } from '../../../types';

definePlugin(({ registerService }) => {
  const selected = new Set<string>();
  const service: ISelectService = {
    set(...ids) {
      selected.clear();
      ids.forEach(id => selected.add(id));
    },
    clear() {
      selected.clear();
    },
    get() {
      return Array.from(selected);
    },
    has(id) {
      return selected.has(id);
    },
  };

  // 注册选择器服务
  registerService(SELECT_SERVICE, service);
});
