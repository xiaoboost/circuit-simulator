import React from 'react';
import { useService, useHook } from '../../../../context';
import {
  type IPartRendererProps,
  IPinRendererHook,
  IConnectionService,
} from '../../../../types';
import { Pin } from './pin';

function PartPinRender({ data: { id }, prototype: { pins } }: IPartRendererProps) {
  const { useDeviceConnections } = useService(IConnectionService);
  const pinRenderers = useHook(IPinRendererHook);
  const connections = useDeviceConnections(id);

  if (pins.length === 0 || pinRenderers.length === 0) {
    return null;
  }

  return pins.map(({ position }, i) => {
    const pinConnections = connections.filter((connection) => connection.originPin === i);
    const isSpace = pinConnections.length === 0;
    const key = `${id}-${i}`;
    return (
      <Pin
        key={key}
        id={key}
        parentId={id}
        pinIndex={i}
        position={position}
        hoverR={4}
        normalR={isSpace ? 0 : 2}
        fill={isSpace ? '#fff' : undefined}
      />
    );
  });
}

export const Render = React.memo(PartPinRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
