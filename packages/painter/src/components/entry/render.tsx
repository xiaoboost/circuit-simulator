import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import { Drawer } from '../drawer';
import { Viewer } from '../viewer';
import { type PainterProps } from '../wrapper';
import * as Styles from './styles.css';
import {
  useMouseListener,
  useKeyboardListener,
  useElectronicChangeAdapter,
} from './use';

export function Entry(props: PainterProps) {
  const mouseListener = useMouseListener();
  const keyboardListener = useKeyboardListener();

  useElectronicChangeAdapter(props);

  return (
    <div
      className={scl(Styles.entry, props.className)}
      style={props.style}
      ref={keyboardListener}
      onContextMenu={(e) => e.preventDefault()}
      {...mouseListener}
    >
      <Drawer />
      <Viewer />
    </div>
  );
}
