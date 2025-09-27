import { Point } from '@circuit/algorithm';
import { createSorter } from '@circuit/shared';
import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useHook, Watcher, useWatcher } from '../../../../context';
import { IPainterContextMenuItemHook, IPainterContextMenuItemCategory } from '../../../../types';
import { Divider } from './driver';
import * as Styles from './styles.less';

const categories = [IPainterContextMenuItemCategory.Edit];

export function RenderWithVisible(visible: Watcher<boolean>, $position: Watcher<Point>) {
  return function Render() {
    const [isVisible, setVisible] = useWatcher(visible);
    const [position] = useWatcher($position);
    const ref = useRef<HTMLDivElement>(null);
    const actions = useHook(IPainterContextMenuItemHook, 'asc');

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
      if (isVisible && ref.current && ref.current.children.length === 0) {
        ref.current.style.display = 'none';
        setVisible(false);
      }
    }, [ref.current, isVisible]);

    if (!isVisible || actions.length === 0) {
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
