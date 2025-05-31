import React from 'react';
import { usePainterService, usePainterHook, useComposeHOC } from '../../../../context';
import {
  IPartRendererProps,
  MAP_SERVICE,
  PIN_RENDERER,
  IPinRendererProps,
} from '../../../../types';

function PartPinRender({ data: { id }, prototype: { pins } }: IPartRendererProps) {
  const { getPinConnectionByPin } = usePainterService(MAP_SERVICE);
  const pinRenderers = usePainterHook(PIN_RENDERER);
  const pinComposedRenderers = pinRenderers.map(useComposeHOC);

  if (pins.length === 0 || pinComposedRenderers.length === 0) {
    return null;
  }

  return (
    <>
      {pins.map(({ position }, index) => {
        const connections = getPinConnectionByPin(id, index);
        const isSpace = !connections || connections.length === 0;

        return (
          <>
            {pinComposedRenderers.map(({ Component, getKey }) => {
              const props: IPinRendererProps = {
                id: `${id}-${index}`,
                position,
                hoverR: 4,
                normalR: 0,
                fill: isSpace ? '#fff' : undefined,
              };
              const key = getKey(props);
              return <Component key={key} $$key={key} {...props} />;
            })}
          </>
        );
      })}
    </>
  );
}

export const Render = React.memo(PartPinRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
