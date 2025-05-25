import { stringifyClass as sc } from '@xiao-ai/utils';
import React from 'react';
import * as Styles from './styles.less';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'onClick'> {
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export function Icon(props: IconProps) {
  return (
    <span
      className={sc(Styles.icon, props.className)}
      onClick={props.onClick}
    >
      {props.children}
    </span>
  );
}
