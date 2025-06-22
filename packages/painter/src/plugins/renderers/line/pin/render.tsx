import { isEqualPoint } from '@circuit/algorithm';
import { CONNECTION_SERVICE } from '@circuit/shared';
import React from 'react';
import { useService, useHook, useComposeHOC } from '../../../../context';
import {
  ILineRendererProps,
  PIN_RENDERER,
  IPinRendererProps,
} from '../../../../types';

function PartPinRender({ data: { id, path } }: ILineRendererProps) {
  const { getConnections } = useService(CONNECTION_SERVICE);
  const pinRenderers = useHook(PIN_RENDERER);
  const pinComposedRenderers = pinRenderers.map(useComposeHOC);

  if (path.length === 0 || pinComposedRenderers.length === 0) {
    return null;
  }

  const pins = [path[0], path[path.length - 1]];

  if (pins[0][0] === pins[1][0] && pins[0][1] === pins[1][1]) {
    pins.pop();
  }

  return (
    <>
      {pins.map((position, i) => {
        const connections = getConnections(id, i);
        const isSpace = connections.length === 0;

        return pinComposedRenderers.map(({ Component, getKey }) => {
          const props: IPinRendererProps = {
            id: `${id}-${i}`,
            position,
            hoverR: isSpace ? 5: 4,
            normalR: isSpace ? 2 : 1,
            fill: isSpace ? '#fff' : undefined,
          };
          const key = getKey?.(props) ?? `${id}-${i}`;
          return <Component key={key} $$key={key} {...props} />;
        });
      })}
    </>
  );
}

export const Render = React.memo(
  PartPinRender,
  ({ data: { path: prevPath } }, { data: { path: nextPath } }) => (
    prevPath.length === nextPath.length &&
    isEqualPoint(prevPath[0], nextPath[0]) &&
    isEqualPoint(prevPath[prevPath.length - 1], nextPath[nextPath.length - 1])
  ),
);
