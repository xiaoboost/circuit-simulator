import React from 'react';
import { usePainterHook, useComposeHOC } from '../../../../context';
import { IDrawLayerProps, LINE_RENDERER } from '../../../../types';

function LineLayerRender({ lines }: IDrawLayerProps) {
  const lineRenderers = usePainterHook(LINE_RENDERER, 'asc');
  const lineComposedRenderers = lineRenderers.map(useComposeHOC);

  if (lineComposedRenderers.length === 0) {
    return null;
  }

  return (
    <>
      {lines.map((line, index) => (
        <g key={line.id ?? index}>
          {lineComposedRenderers.map(({ Component, getKey }) => {
            const props = { data: line };
            const key = getKey(props);
            return <Component key={key} $$key={key} {...props} />;
          })}
        </g>
      ))}
    </>
  );
}

export const Render = React.memo(
  LineLayerRender,
  ({ lines: prev }, { lines: next }) => (
    prev.length === next.length &&
    prev.every((line, i) => line === next[i])
  ),
);
