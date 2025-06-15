import {
  PartStructuredData,
  LineStructuredData,
} from '@circuit/types';
import React from 'react';

/** 画布组件参数 */
export interface PainterProps {
  /** 画布组件的类名 */
  className?: string;
  /** 画布组件的样式 */
  style?: React.CSSProperties;
  /** 电路图的线条数据 */
  lines?: LineStructuredData[];
  /** 电路图的元件数据 */
  parts?: PartStructuredData[];
}

export function Painter(props: PainterProps) {
  return <div>Painter</div>;
}
