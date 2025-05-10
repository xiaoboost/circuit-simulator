import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useRef } from 'react';
import { Drawer } from '../drawer';
import { Viewer } from '../viewer';
import { type PainterProps } from '../wrapper';
import * as Styles from './styles.css';
import {
  useMouseListener,
  useKeyboardListener,
  useElectronicChangeAdapter,
  usePainterRefService,
} from './use';

export function Entry(props: PainterProps) {
  const painterRef = useRef<HTMLDivElement>(null);
  const mouseListener = useMouseListener();

  usePainterRefService(painterRef);
  useKeyboardListener(painterRef);
  useElectronicChangeAdapter(props);

  return (
    <div
      className={scl(Styles.entry, props.className)}
      role="button"
      style={props.style}
      ref={painterRef}
      tabIndex={0}
      onContextMenu={(e) => e.preventDefault()}
      {...mouseListener}
    >
      <Drawer />
      <Viewer />
    </div>
  );
}
