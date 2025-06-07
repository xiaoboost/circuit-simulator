import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useRef } from 'react';
import { Drawer } from '../drawer';
import { Viewer } from '../viewer';
import { type PainterProps } from '../wrapper';
import * as Styles from './styles.less';
import {
  useKeyboardListener,
  usePainterAdapter,
  usePainterRefService,
} from './use';

export function Entry(props: PainterProps) {
  const painterRef = useRef<HTMLDivElement>(null);

  usePainterRefService(painterRef);
  useKeyboardListener(painterRef);
  usePainterAdapter(props);

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
}
