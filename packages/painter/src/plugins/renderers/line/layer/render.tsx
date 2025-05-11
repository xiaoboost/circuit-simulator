import React from 'react';
import { usePainterHook } from '../../../../context';
import { IDrawLayerProps, LINE_RENDERER } from '../../../../types';

export function Render({ lines }: IDrawLayerProps) {
  const lineRenderers = usePainterHook(LINE_RENDERER, 'asc');

  if (lineRenderers.length === 0) {
    return null;
  }

  return (
    <g>
      {lines.map((line, index) => (
        <g key={line.id ?? index}>
          {lineRenderers.map(({ name, Render }) => (
            <Render key={name} data={line} />
          ))}
        </g>
      ))}
    </g>
  );
}
