import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import * as Styles from './styles.module.less';

export interface ButtonProps {
  /** 按钮图标 */
  icon: React.ReactNode;
  /** 按钮是否活动 */
  active?: boolean;
  /** 按钮内容 */
  children: React.ReactNode;
  /** 按钮附加内容 */
  addonAfter?: React.ReactNode;
  /** 按钮 DOM 引用 */
  domRef?: React.RefObject<HTMLDivElement | null>;
  /** 按钮类名 */
  className?: string;
  /** 按钮样式 */
  style?: React.CSSProperties;
  /** 按钮鼠标点击事件 */
  onClick?(event: React.MouseEvent<HTMLDivElement>): void;
  /** 按钮鼠标进入事件 */
  onMouseEnter?(event: React.MouseEvent<HTMLDivElement>): void;
  /** 按钮鼠标离开事件 */
  onMouseLeave?(event: React.MouseEvent<HTMLDivElement>): void;
}

export function Button(props: ButtonProps) {
  const {
    icon,
    children,
    addonAfter,
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
    domRef,
    active,
    style,
  } = props;

  return (
    <div
      className={scl(Styles.button, className, {
        [Styles.active]: active,
      })}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={domRef}
    >
      <span className={Styles.content}>
        <span className={Styles.icon}>{icon}</span>
        <span className={Styles.text}>{children}</span>
      </span>
      {addonAfter && <span className={Styles.addonAfter}>{addonAfter}</span>}
    </div>
  );
}
