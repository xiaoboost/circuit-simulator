import React, { useEffect, useRef } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const actions = useHook(IContextMenuItemHook, 'asc');
  const contextMenuService = useService(IContextMenuService);
  const [visible, setVisible] = useWatcher(contextMenuService.visible);
  const [position] = useWatcher(contextMenuService.position);
  const hoverService = useService(IHoverService);
  const selectService = useService(ISelectService);

  useEffect(() => {
    const closeContextMenu = (event: MouseEvent) => {
      if (
        event.button === 0
        && ref.current
        && !ref.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.body.addEventListener('mousedown', closeContextMenu);

    return () => {
      document.body.removeEventListener('mousedown', closeContextMenu);
    };
  }, []);

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
    .map((item) => item.concat(<Divider />))
    .flat()
    .slice(0, -1);

  // 什么都没有，直接不渲染
  if (rendered.length === 0) {
    return;
  }

  return (
    <div
      ref={ref}
      className={Styles.contextMenu}
      style={{ left: position[0], top: position[1] }}
    >
      {rendered}
    </div>
  );
}
