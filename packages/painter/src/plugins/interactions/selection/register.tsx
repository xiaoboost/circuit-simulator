import {
  definePlugin,
  ISelectService,
  IEventListenerHook,
  IHoverService,
} from '@circuit/contracts/painter';

definePlugin(({ registerHook, getService }) => {
  function handleClick(event: MouseEvent) {
    const selectService = getService(ISelectService);
    const { current: { data: hover } } = getService(IHoverService);

    // 鼠标没有悬停在任何实体上
    if (!hover) {
      selectService.clear();
      return;
    }

    // 按住 Shift 键，添加到选中内容中
    if (event.shiftKey) {
      selectService.add(hover.id);
      return;
    }

    // 没有按住 Shift 键
    // 左键
    if (event.button === 0) {
      selectService.set(hover.id);
      return;
    }

    // 右键只有当当前实体没有被选中时才设置选中
    if (event.button === 2 && !selectService.value.data.has(hover.id)) {
      selectService.set(hover.id);
      return;
    }
  }

  registerHook(IEventListenerHook, {
    onClick: handleClick,
    onRightClick: handleClick,
  });
});
