import React from 'react';
import * as Styles from './styles.module.less';

export interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 按钮图标 */
  icon: React.ReactNode;
  /** 按钮内容 */
  children: React.ReactNode;
  /** 按钮附加内容 */
  addonAfter?: React.ReactNode;
  /** 按钮 DOM 引用 */
  domRef?: React.RefObject<HTMLDivElement | null>;
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
    onContextMenu,
    onFocus,
    onBlur,
    title,
    style,
    tabIndex,
    role,
    domRef,
  } = props;

  return (
    <div
      className={`${Styles.button}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
      onFocus={onFocus}
      onBlur={onBlur}
      title={title}
      style={style}
      tabIndex={tabIndex}
      role={role}
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
