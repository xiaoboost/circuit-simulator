import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import { Drawer } from '../drawer';
import { Viewer } from '../viewer';
import * as Styles from './styles.css';
import { useEventListener } from './use';

export interface EntryProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Entry(props: EntryProps) {
  const eventListener = useEventListener();

  return (
    <div
      className={scl(Styles.entry, props.className)}
      style={props.style}
      onContextMenu={(e) => e.preventDefault()}
      {...eventListener}
    >
      <Drawer />
      <Viewer />
    </div>
  );
}
