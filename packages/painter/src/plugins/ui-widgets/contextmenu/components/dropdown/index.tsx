import { Dropdown as AntDropdown, type MenuProps } from 'antd';
import React from 'react';
import { Button } from '../button';

export interface Content {
  /** 按钮图标 */
  icon: React.ReactNode;
  /** 按钮内容 */
  children: React.ReactNode;
}

export interface ItemData<T> extends Content {
  /** 副文本 */
  subText?: string;
  /** 按钮值 */
  key: T;
  /** 是否禁用 */
  disabled?: boolean;
}

export interface DropdownProps<T extends string> extends Content {
  /** 下拉菜单列表 */
  list: ItemData<T>[];
  /** 点击选项事件 */
  onClickItem(value: T): void;
}

export function Dropdown<T extends string>(props: DropdownProps<T>) {
  const items: MenuProps['items'] = props.list.map((item) => {
    return {
      key: item.key,
      label: item.children,
      icon: item.icon,
      disabled: item.disabled,
    };
  });

  return (
    <AntDropdown menu={{ items }} trigger={['hover']}>
      <Button icon={props.icon}>
        {props.children}
      </Button>
    </AntDropdown>
  );
}
