import { Point } from '@circuit/algorithm';
import { IOverlayRender, IHotKeyHook } from '@circuit/contracts/global';
import {
  definePlugin,
  IEventListenerHook,
  IDragSceneService,
  IContextMenuService,
} from '@circuit/contracts/painter';
import { FloatingContainer } from './floating';
import { Render } from './render';

definePlugin(({ registerHook, getService, root }) => {
  const { registerHook: registerHookInRoot } = root();

  // 注册右键菜单渲染层到根作用域
  registerHookInRoot(IOverlayRender, {
    name: 'ContextMenuLayer',
    order: 0,
    Render,
  });

  // 注册右键菜单独立浮层到根作用域
  registerHookInRoot(IOverlayRender, {
    name: 'ContextMenuFloatingLayer',
    order: 9,
    Render: FloatingContainer,
  });

  // 注册关闭菜单事件
  registerHookInRoot(IHotKeyHook, {
    key: 'esc',
    name: '关闭右键菜单',
    action: () => {
      getService(IContextMenuService).close();
    },
  });

  // 注册鼠标事件
  registerHook(IEventListenerHook, {
    // 需要给 Select 服务之后运行
    order: 99,
    onRightClick(event) {
      const dragSceneService = getService(IDragSceneService);

      if (!dragSceneService.isDragging()) {
        getService(IContextMenuService).openAt(new Point(event.pageX, event.pageY));
      }
    },
  });
});
