import React from 'react';
import { usePainterHook } from '../../../../context';
import { IDrawLayerProps, LINE_RENDERER } from '../../../../types';
import { createSorter } from '../../../../utils';

export function Render({ lines }: IDrawLayerProps) {
  const lineRenderers = usePainterHook(LINE_RENDERER).sort(createSorter('asc'));

  return (
    <>
      {lines.map((line, index) => (
        <g key={line.id ?? index}>
          {lineRenderers.map(({ name, Render }) => (
            <Render key={name} data={line} />
          ))}
        </g>
      ))}
    </>
  );
}
