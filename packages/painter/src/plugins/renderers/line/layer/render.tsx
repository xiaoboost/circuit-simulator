import React, { useMemo } from 'react';
import { usePainterHook } from '../../../../context';
import { composeRendererHOC } from '../../../../context/utils';
import { IDrawLayerProps, LINE_RENDERER, RENDERER_HOC } from '../../../../types';

export function Render({ lines }: IDrawLayerProps) {
  const lineRenderers = usePainterHook(LINE_RENDERER, 'asc');
  const HocHooks = usePainterHook(RENDERER_HOC, 'desc');
  const Renders = useMemo(() => {
    return lineRenderers.map((hook) => ({
      ...hook,
      Render: composeRendererHOC(hook.Render, HocHooks),
    }));
  }, [lineRenderers, HocHooks]);

  if (Renders.length === 0) {
    return null;
  }

  return (
    <g>
      {lines.map((line, index) => (
        <g key={line.id ?? index}>
          {Renders.map(({ name, Render, getKey }) => (
            <Render
              key={name}
              $$key={getKey({ data: line })}
              data={line}
            />
          ))}
        </g>
      ))}
    </g>
  );
}
