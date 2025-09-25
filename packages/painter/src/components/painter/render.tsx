import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useRef } from 'react';
import { Drawer } from '../drawer';
import { Viewer } from '../viewer';
import {
  useHotkeyDriver,
  usePainterRefService,
  usePainterInit,
} from './driver';
import * as Styles from './styles.less';

/** 画布组件参数 */
export interface PainterProps {
  /** 画布组件的类名 */
  className?: string;
  /** 画布组件的样式 */
  style?: React.CSSProperties;
}

export const Painter = React.memo(function Painter(props: PainterProps) {
  const painterRef = useRef<HTMLDivElement>(null);

  usePainterInit();
  usePainterRefService(painterRef);
  useHotkeyDriver(painterRef);

  return (
    <main
      className={scl(Styles.entry, props.className)}
      style={props.style}
      ref={painterRef}
      tabIndex={-1}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Drawer />
      <Viewer />
    </main>
  );
});
