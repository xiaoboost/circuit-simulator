import React from 'react';
import { usePainterHook } from '../../../../context';
import { composeRendererHOC } from '../../../../context/utils';
import { IDrawLayerProps, LINE_RENDERER, RENDERER_HOC } from '../../../../types';

export function Render({ lines }: IDrawLayerProps) {
  const lineRenderers = usePainterHook(LINE_RENDERER, 'asc');
  const hooks = usePainterHook(RENDERER_HOC, 'desc');

  if (lineRenderers.length === 0) {
    return null;
  }

  return (
    <g>
      {lines.map((line, index) => (
        <g key={line.id ?? index}>
          {lineRenderers.map(({ name, Render, getKey }) => {
            if (hooks.length === 0) {
              return <Render key={name} data={line} />;
            }

            const key = getKey({ data: line });
            const RenderWithHoc = composeRendererHOC(Render, hooks);

            return <RenderWithHoc key={key} $$key={key} data={line}  />;
          })}
        </g>
      ))}
    </g>
  );
}
