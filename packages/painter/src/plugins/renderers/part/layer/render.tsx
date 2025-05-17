import React from 'react';
import { usePainterHook, usePainterService } from '../../../../context';
import { composeRendererHOC } from '../../../../context/utils';
import {
  IDrawLayerProps,
  PART_RENDERER,
  ELECTRONIC_SERVICE_KEY,
  RENDERER_HOC,
} from '../../../../types';

export function Render({ parts }: IDrawLayerProps) {
  const partRenderers = usePainterHook(PART_RENDERER, 'asc');
  const service = usePainterService(ELECTRONIC_SERVICE_KEY);
  const hooks = usePainterHook(RENDERER_HOC, 'desc');

  if (partRenderers.length === 0) {
    return null;
  }

  return (
    <g>
      {parts.map((part) => {
        const prototype = service.getPartPrototype(part.kind);

        return (
          <g
            key={part.id}
            transform={`matrix(${part.rotate.join()},${part.position.join()})`}
          >
            {partRenderers.map(({ name, Render, getKey }) => {
              if (hooks.length === 0) {
                return <Render key={name} data={part} prototype={prototype} />;
              }

              const key = getKey({ data: part, prototype });
              const RenderWithHoc = composeRendererHOC(Render, hooks);

              return <RenderWithHoc key={key} $$key={key} data={part} prototype={prototype} />;
            })}
          </g>
        );
      })}
    </g>
  );
}
