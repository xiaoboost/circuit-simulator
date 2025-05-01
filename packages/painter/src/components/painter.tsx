import React, { useRef } from 'react';
import { PainterContext } from '../context/context';
import { usePainterInit, usePainterUnmount } from '../context/react';
import { IPainterContext } from '../context/types';

export interface PainterProps {
  className?: string;
  style?: React.CSSProperties;
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
      <div className={props.className} style={props.style}>
        <div>Painter</div>
      </div>
    </PainterContext.Provider>
  );
}
