import { PartStructuredData, LineStructuredData } from '@circuit/electronics';
import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useRef } from 'react';
import { PainterContext } from '../../context/context';
import { usePainterInit, usePainterUnmount } from '../../context/react';
import { IPainterContext } from '../../context/types';
import * as Styles from './styles.css';

export interface PainterProps {
  className?: string;
  style?: React.CSSProperties;
  lines: LineStructuredData[];
  parts: PartStructuredData[];
}

export function Painter(props: PainterProps) {
  const context = useRef<IPainterContext>({
    ServiceMap: new Map(),
    HookMap: new Map(),
    PluginUninstallers: [],
  });

  usePainterInit(context.current);
  usePainterUnmount(context.current);

  return (
    <PainterContext.Provider value={context.current}>
      <div className={scl(props.className, Styles.painter)} style={props.style}>
        <div>Painter</div>
      </div>
    </PainterContext.Provider>
  );
}
