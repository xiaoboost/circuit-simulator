import React from 'react';
import { usePainterHook, usePainterService } from '../../../../context';
import { IDrawLayerProps, PART_RENDERER, ELECTRONIC_SERVICE_KEY } from '../../../../types';
import { createSorter } from '../../../../utils';

export function Render({ parts }: IDrawLayerProps) {
  const partRenderers = usePainterHook(PART_RENDERER).sort(createSorter('asc'));
  const service = usePainterService(ELECTRONIC_SERVICE_KEY);

  return (
    <>
      {parts.map((part) => {
        const prototype = service.getPartPrototype(part.kind);

        if (!prototype) {
          throw new Error('未找到器件原型');
        }

        return (
          <g
            key={part.id}
            transform={`matrix(${part.rotate.join()},${part.position.join()})`}
          >
            {partRenderers.map(({ name, Render }) => (
              <Render key={name} data={part} prototype={prototype} />
            ))}
          </g>
        );
      })}
    </>
  );
}
