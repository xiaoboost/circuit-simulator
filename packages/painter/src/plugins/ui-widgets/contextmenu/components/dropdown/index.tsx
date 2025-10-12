import { RightOutlined } from '@circuit/icons';
import { computePosition, flip } from '@floating-ui/dom';
import { stringifyClass as scl } from '@xiao-ai/utils';
import { AnimatePresence, motion } from 'motion/react';
import React, { useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useService, useWatcher } from '../../../../../context';
import { IContextMenuService } from '../../../../../types';
import { Button } from '../button';
import * as styles from './styles.module.less';

export interface Content {
  /** 按钮图标 */
  icon: React.ReactNode;
  /** 按钮内容 */
  children: React.ReactNode;
}

export interface ItemData<T extends string | number> extends Content {
  /** 按钮值 */
  key: T;
  /** 附加内容 */
  addonAfter?: string;
}

export interface DropdownProps<T extends string | number> extends Content {
  /** 下拉菜单名称 */
  name: string;
  /** 下拉菜单样式 */
  dropdownStyle?: React.CSSProperties;
  /** 下拉菜单类名称 */
  dropdownClassName?: string;
  /** 下拉菜单列表 */
  list: ItemData<T>[];
  /** 点击选项事件 */
  onClickItem?(value: T): void;
  /** 按钮鼠标进入事件 */
  onMouseEnter?(event: React.MouseEvent<HTMLDivElement>): void;
  /** 按钮鼠标离开事件 */
  onMouseLeave?(event: React.MouseEvent<HTMLDivElement>): void;
}

export function Dropdown<T extends string | number>(props: DropdownProps<T>) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contextMenuService = useService(IContextMenuService);
  const [openDropdown] = useWatcher(contextMenuService.openDropdown);
  const active = openDropdown === props.name;

  useLayoutEffect(() => {
    if (!buttonRef.current || !menuRef.current || !active) {
      return;
    }

    computePosition(buttonRef.current, menuRef.current, {
      placement: 'right-start',
      middleware: [flip({ padding: 8 })],
    }).then(({ x, y }) => {
      menuRef.current!.style.left = `${x}px`;
      menuRef.current!.style.top = `${y}px`;
    });
  }, [active]);

  // 如果浮层容器不存在，则不渲染
  if (!contextMenuService.floatingElRef.current) {
    throw new Error('浮层容器不存在');
  }

  const menus = (
    <AnimatePresence>
      {active && (
        <motion.div
          className={scl(styles.dropdownContainer, props.dropdownClassName)}
          ref={menuRef}
          style={{
            ...props.dropdownStyle,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className={styles.dropdownContent}>
            {props.list.map((item) => (
              <Button
                icon={item.icon}
                key={item.key}
                addonAfter={item.addonAfter}
                onClick={() => {
                  props.onClickItem?.(item.key);
                }}
              >
                {item.children}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <Button
      domRef={buttonRef}
      icon={props.icon}
      addonAfter={<RightOutlined />}
      active={active}
      onMouseLeave={props.onMouseLeave}
      onMouseEnter={props.onMouseEnter}
    >
      {props.children}
      {createPortal(menus, contextMenuService.floatingElRef.current)}
    </Button>
  );
}
