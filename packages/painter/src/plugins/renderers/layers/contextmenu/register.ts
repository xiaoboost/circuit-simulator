import { Point } from '@circuit/algorithm';
import { IOverlayRender, IHotKeyHook } from '@circuit/shared';
import { definePlugin, Watcher } from '../../../../context';
import { IEventListenerHook, IDragSceneService } from '../../../../types';
import { RenderWithWatcher } from './render';

definePlugin(({ registerHook, getService, root }) => {
  const { registerHook: registerHookInRoot } = root();
  const visible = new Watcher<boolean>(false);
  const position = new Watcher<Point>(new Point(0, 0));

  // 注册右键菜单渲染层到根作用域
  registerHookInRoot(IOverlayRender, {
    name: 'ContextMenuLayer',
    order: 0,
    Render: RenderWithWatcher(visible, position),
  });

  // 注册关闭菜单事件
  registerHookInRoot(IHotKeyHook, {
    key: 'esc',
    name: '关闭右键菜单',
    action: () => {
      visible.setData(false);
    },
  });

  // 注册鼠标事件
  registerHook(IEventListenerHook, {
    // 需要给 Select 服务之后运行
    order: 99,
    onMouseDown(event) {
      const { isDragging } = getService(IDragSceneService);

      if (!isDragging.data && event.button === 2) {
        visible.setData(true);
        position.setData(new Point(event.pageX, event.pageY));
      }
    },
  });
});
