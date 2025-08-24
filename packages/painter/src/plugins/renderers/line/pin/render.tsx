import { isEqualPoint } from '@circuit/algorithm';
import React from 'react';
import { useService, useHook } from '../../../../context';
import {
  type ILineRendererProps,
  PIN_RENDERER,
  CONNECTION_SERVICE,
} from '../../../../types';
import { Pin } from './pin';

function LinePinRender({ data: { id, path }, style }: ILineRendererProps) {
  const { getConnections } = useService(CONNECTION_SERVICE);
  const pinRenderers = useHook(PIN_RENDERER);

  if (path.length === 0 || pinRenderers.length === 0) {
    return null;
  }

  const pins = [path[0], path[path.length - 1]];

  return pins.map((position, i) => {
    const connections = getConnections(id, i);
    const isSpace = connections.length === 0;
    const key = `${id}-${i}`;
    return (
      <Pin
        key={key}
        id={key}
        parentId={id}
        pinIndex={i}
        style={style}
        position={position}
        hoverR={isSpace ? 5: 4}
        normalR={isSpace ? 2 : 1}
        fill={isSpace ? '#fff' : undefined}
      />
    );
  });
}

export const Render = React.memo(
  LinePinRender,
  ({ data: { path: prevPath } }, { data: { path: nextPath } }) => (
    prevPath.length === nextPath.length &&
    isEqualPoint(prevPath[0], nextPath[0]) &&
    isEqualPoint(prevPath[prevPath.length - 1], nextPath[nextPath.length - 1])
  ),
);
