import React from 'react';
import { usePainterHook } from '../../../../context';
import { composeHOC } from '../../../../context/utils';
import { IDrawLayerProps, LINE_RENDERER, RENDERER_HOC } from '../../../../types';

function LineLayerRender({ lines }: IDrawLayerProps) {
  const lineRenderers = usePainterHook(LINE_RENDERER, 'asc');
  const HocHooks = usePainterHook(RENDERER_HOC, 'desc');

  if (lineRenderers.length === 0) {
    return null;
  }

  return (
    <>
      {lines.map((line, index) => (
        <g key={line.id ?? index}>
          {lineRenderers.map((Render) => (
            composeHOC({ data: line }, Render, HocHooks)
          ))}
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
