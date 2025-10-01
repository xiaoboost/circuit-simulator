import React, { MouseEvent } from 'react';
import * as Styles from './styles.module.less';

export interface ButtonProps {
  /** 按钮图标 */
  icon: React.ReactNode;
  /** 按钮内容 */
  children: React.ReactNode;
  /** 按钮副文本 */
  subText?: string;
  /** 按钮点击事件 */
  onClick?(event: MouseEvent<HTMLDivElement>): void;
}

export function Button(props: ButtonProps) {
  return (
    <div className={Styles.button} onClick={props.onClick}>
      <span className={Styles.content}>
        <span className={Styles.icon}>{props.icon}</span>
        <span className={Styles.text}>{props.children}</span>
      </span>
      {props.subText && <span className={Styles.subText}>{props.subText}</span>}
    </div>
  );
}
