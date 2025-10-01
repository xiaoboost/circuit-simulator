import { Point } from '@circuit/algorithm';
import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useHook, useWatcher, Watcher, createSorter } from '../../../../context';
import {
  IPainterContextMenuItemHook,
  IPainterContextMenuItemCategory,
} from '../../../../types';
import { Divider } from './driver';
import * as Styles from './styles.less';

const categories = [IPainterContextMenuItemCategory.Edit];

export function RenderWithWatcher($visible: Watcher<boolean>, $position: Watcher<Point>) {
  return function Render() {
    const ref = useRef<HTMLDivElement>(null);
    const actions = useHook(IPainterContextMenuItemHook, 'asc');
    const [visible, setVisible] = useWatcher($visible);
    const [position] = useWatcher($position);

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

    useLayoutEffect(() => {
      // 没有子元素时，直接不显示
      if (visible && ref.current && ref.current.children.length === 0) {
        ref.current.style.display = 'none';
        setVisible(false);
      }
    }, [ref.current, visible]);

    if (!visible || actions.length === 0) {
      return;
    }

    const rendered = categories
      .map((category) => {
        return actions
          .filter((action) => action.category === category)
          .sort(createSorter('asc'))
          .map(({ name, Render }) => (
            <Render
              key={name}
              onHide={() => setVisible(false)}
            />
          ))
          .concat(<Divider />);
      })
      .flat()
      .slice(0, -1);

    return (
      <div
        ref={ref}
        className={Styles.contextMenu}
        style={{ left: position[0], top: position[1] }}
      >
        {rendered}
      </div>
    );
  };
}
