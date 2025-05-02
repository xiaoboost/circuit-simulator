import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import { Drawer } from '../drawer';
import { Viewer } from '../viewer';
import * as Styles from './styles.css';
import { useMouseListener, useKeyboardListener } from './use';

export interface EntryProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Entry(props: EntryProps) {
  const mouseListener = useMouseListener();
  const keyboardListener = useKeyboardListener();

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
