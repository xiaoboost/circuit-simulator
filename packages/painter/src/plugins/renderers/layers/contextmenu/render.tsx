import { computePosition, flip } from '@floating-ui/dom';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useHook, useWatcher, createSorter, useService } from '../../../../context';
import {
  IContextMenuItemHook,
  IContextMenuItemCategory,
  IContextMenuService,
  IContextMenuItemVisibleProps,
  IHoverService,
  ISelectService,
} from '../../../../types';
import { Divider } from './driver';
import * as Styles from './styles.less';

const categories = [IContextMenuItemCategory.Visual, IContextMenuItemCategory.Edit];

export function Render() {
  const menuRef = useRef<HTMLDivElement>(null);
  const actions = useHook(IContextMenuItemHook, 'asc');
  const contextMenuService = useService(IContextMenuService);
  const [visible, setVisible] = useWatcher(contextMenuService.visible);
  const [position] = useWatcher(contextMenuService.position);
  const hoverService = useService(IHoverService);
  const selectService = useService(ISelectService);
  const anchorRef = useRef<HTMLDivElement>(null);

  // 关闭菜单事件
  useEffect(() => {
    const closeContextMenu = (event: MouseEvent) => {
      if (
        event.button === 0
        && menuRef.current
        && !menuRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.body.addEventListener('mousedown', closeContextMenu);

    return () => {
      document.body.removeEventListener('mousedown', closeContextMenu);
    };
  }, []);

  // 计算菜单位置
  useLayoutEffect(() => {
    if (!anchorRef.current || !menuRef.current || !visible) {
      return;
    }

    computePosition(anchorRef.current, menuRef.current, {
      placement: 'right-start',
      middleware: [flip({ padding: 8 })],
    }).then(({ x, y }) => {
      menuRef.current!.style.left = `${x}px`;
      menuRef.current!.style.top = `${y}px`;
    });
  }, [
    anchorRef.current, position, visible,
  ]);

  // 关闭菜单时，清空下拉菜单
  useEffect(() => {
    // 初始化下拉菜单
    if (!visible) {
      contextMenuService.openDropdown.setData('');
    }
  }, [visible]);

  if (!visible || actions.length === 0) {
    return;
  }

  const visibleProps: IContextMenuItemVisibleProps = {
    hover: hoverService,
    select: selectService,
  };

  const rendered = categories
    .map((category) => {
      return actions
        .filter((action) => action.category === category)
        .sort(createSorter('asc'))
        .map(({ name, Render, visible }) => (
          visible(visibleProps) && (
            <Render
              key={name}
              onHide={() => setVisible(false)}
            />
          )
        ))
        .filter((item) => item !== false);
    })
    .filter((item) => item.length > 0)
    .map((item) => item.concat(<Divider key={Date.now()} />))
    .flat()
    .slice(0, -1);

  // 什么都没有，直接不渲染
  if (rendered.length === 0) {
    return;
  }

  return (
    <>
      <div
        ref={anchorRef}
        className={Styles.anchor}
        style={{ left: position[0], top: position[1] }}
      />
      <div
        ref={menuRef}
        className={Styles.contextMenu}
      >
        {rendered}
      </div>
    </>
  );
}
