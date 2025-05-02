import { PartStructuredData, LineStructuredData } from '@circuit/electronics';
import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useRef } from 'react';
import { PainterContext } from '../../context/context';
import { usePainterInit, usePainterUnmount } from '../../context/react';
import { IPainterContext } from '../../context/types';
import { Entry } from '../entry';
import { wrapper } from './styles.css';

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

  const isReady = usePainterInit(context.current);

  usePainterUnmount(context.current);

  if (!isReady) {
    return <div className={wrapper}>Loading</div>;
  }

  return (
    <PainterContext.Provider value={context.current}>
      <div className={scl(props.className, wrapper)} style={props.style}>
        <Entry />
      </div>
    </PainterContext.Provider>
  );
}
