import {
  PartStructuredData,
  LineStructuredData,
} from '@circuit/electronics';
import React, { useRef } from 'react';
import { PainterContext } from '../../context/context';
import { usePainterInit, usePainterUnmount } from '../../context/react';
import { IPainterContext } from '../../context/types';
import { UpdateElectronic } from '../../types';
import { Entry } from '../entry';

export interface PainterProps {
  className?: string;
  style?: React.CSSProperties;
  lines: LineStructuredData[];
  parts: PartStructuredData[];
  onChange?: (cb: UpdateElectronic) => void;
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
    return <div>Loading</div>;
  }

  return (
    <PainterContext.Provider value={context.current}>
      <Entry {...props} />
    </PainterContext.Provider>
  );
}
