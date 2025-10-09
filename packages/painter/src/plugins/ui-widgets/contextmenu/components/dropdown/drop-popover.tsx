import { IOverlayRender } from '@circuit/shared';
import React from 'react';
import { definePlugin } from '../../../../../context';
import * as styles from './styles.module.less';

/** 浮层元素引用 */
export const PopoverContainer = React.createRef<HTMLDivElement>();

definePlugin(({ root }) => {
  const { registerHook: registerHookInRoot } = root();

  // 注册下拉菜单浮层到根作用域
  registerHookInRoot(IOverlayRender, {
    name: 'DropdownPopover',
    order: 0,
    Render() {
      return <div ref={PopoverContainer} className={styles.popoverContainer}></div>;
    },
  });
});
