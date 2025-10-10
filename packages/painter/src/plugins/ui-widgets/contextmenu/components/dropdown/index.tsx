import { RightOutlined } from '@circuit/icons';
import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../button';
import { PopoverContainer } from './drop-popover';
import * as styles from './styles.module.less';

export interface Content {
  /** 按钮图标 */
  icon: React.ReactNode;
  /** 按钮内容 */
  children: React.ReactNode;
}

export interface ItemData<T> extends Content {
  /** 按钮值 */
  key: T;
  /** 附加内容 */
  addonAfter?: string;
}

export interface DropdownProps<T extends string> extends Content {
  /** 下拉菜单名称 */
  name: string;
  /** 下拉菜单样式 */
  dropdownStyle?: React.CSSProperties;
  /** 下拉菜单类名称 */
  dropdownClassName?: string;
  /** 下拉菜单列表 */
  list: ItemData<T>[];
  /** 点击选项事件 */
  onClickItem(value: T): void;
}

export function Dropdown<T extends string>(props: DropdownProps<T>) {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  // 计算下拉菜单位置
  const calculatePosition = useCallback(() => {
    if (!buttonRef.current || !PopoverContainer.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 估算下拉菜单的尺寸（可以根据实际内容调整）
    const estimatedWidth = 200; // 可以根据实际内容动态计算
    const estimatedHeight = props.list.length * 40 + 16; // 每个按钮约40px高度 + padding

    let left = buttonRect.right + 2; // 默认在右侧
    let top = buttonRect.top;

    // 如果右侧空间不够，显示在左侧
    if (left + estimatedWidth > viewportWidth) {
      left = buttonRect.left - estimatedWidth - 2;
    }

    // 如果下方空间不够，向上显示
    if (top + estimatedHeight > viewportHeight) {
      top = buttonRect.bottom - estimatedHeight;
    }

    // 确保不超出视口边界
    left = Math.max(8, Math.min(left, viewportWidth - estimatedWidth - 8));
    top = Math.max(8, Math.min(top, viewportHeight - estimatedHeight - 8));

    setPosition({ top, left });
  }, [props.list.length]);

  // 显示时计算位置
  useEffect(() => {
    if (visible) {
      calculatePosition();
    }
  }, [visible, calculatePosition]);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  // 如果浮层容器不存在，则不渲染
  if (!PopoverContainer.current) {
    return null;
  }

  const menus = (
    <div
      className={scl(styles.dropdownContainer, props.dropdownClassName)}
      style={{
        ...props.dropdownStyle,
        top: position.top,
        left: position.left,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.dropdownContent}>
        {props.list.map((item) => (
          <Button
            icon={item.icon}
            key={item.key}
            addonAfter={item.addonAfter}
            onClick={() => {
              props.onClickItem(item.key);
              setVisible(false);
            }}
          >
            {item.children}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Button icon={props.icon} addonAfter={<RightOutlined />}>
      {props.children}
      {visible && createPortal(menus, PopoverContainer.current)}
    </Button>
  );
}
