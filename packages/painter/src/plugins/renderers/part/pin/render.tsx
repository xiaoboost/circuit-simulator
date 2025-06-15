import React from 'react';
import { useService, useHook, useComposeHOC } from '../../../../context';
import {
  IPartRendererProps,
  CONNECTION_SERVICE,
  PIN_RENDERER,
  IPinRendererProps,
} from '../../../../types';

function PartPinRender({ data: { id }, prototype: { pins } }: IPartRendererProps) {
  const { getConnections } = useService(CONNECTION_SERVICE);
  const pinRenderers = useHook(PIN_RENDERER);
  const pinComposedRenderers = pinRenderers.map(useComposeHOC);

  if (pins.length === 0 || pinComposedRenderers.length === 0) {
    return null;
  }

  return (
    <>
      {pins.map(({ position }, index) => {
        const connections = getConnections(id, index);
        const isSpace = !connections || connections.length === 0;

        return pinComposedRenderers.map(({ Component, getKey }) => {
          const props: IPinRendererProps = {
            id: `${id}-${index}`,
            position,
            hoverR: 4,
            normalR: 0,
            fill: isSpace ? '#fff' : undefined,
          };
          const key = getKey?.(props) ?? `${id}-${index}`;
          return <Component key={key} $$key={key} {...props} />;
        });
      })}
    </>
  );
}

export const Render = React.memo(PartPinRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
