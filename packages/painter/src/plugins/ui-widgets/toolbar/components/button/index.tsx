import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import * as Styles from './styles.css';

export interface ButtonProps {
  /** 按钮点击事件 */
  onClick?: () => void;
  /** 按钮是否被选中 */
  selected?: boolean;
  /** 按钮是否禁用 */
  disabled?: boolean;
}

export function Button(props: React.PropsWithChildren<ButtonProps>) {
  const onClick = () => {
    if (!props.disabled) {
      props.onClick?.();
    }
  };

  return (
    <button
      onClick={onClick}
      className={scl(Styles.btn, {
        [Styles.selected]: props.selected,
        [Styles.disabled]: props.disabled,
      })}
    >
      <div className={Styles.icon}>{props.children}</div>
    </button>
  );
}
