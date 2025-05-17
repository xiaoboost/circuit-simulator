import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useMemo } from 'react';
import { useWatcher, usePainterHook, usePainterService } from '../../../../context';
import { composeRendererHOC } from '../../../../context/utils';
import {
  IDrawLayerProps,
  PART_RENDERER,
  ELECTRONIC_SERVICE_KEY,
  RENDERER_HOC,
  SELECT_SERVICE,
} from '../../../../types';
import { selected } from './styles.css';

export function Render({ parts }: IDrawLayerProps) {
  const partRenderers = usePainterHook(PART_RENDERER, 'asc');
  const service = usePainterService(ELECTRONIC_SERVICE_KEY);
  const HocHooks = usePainterHook(RENDERER_HOC, 'desc');
  const selectService = usePainterService(SELECT_SERVICE);
  const [selectedIds] = useWatcher(selectService.value);
  const LayerRenders = useMemo(() => {
    return partRenderers.map((hook) => ({
      ...hook,
      Render: composeRendererHOC(hook.Render, HocHooks),
    }));
  }, [partRenderers, HocHooks]);

  if (LayerRenders.length === 0) {
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
            className={scl({
              [selected]: selectedIds.has(part.id),
            })}
          >
            {LayerRenders.map(({ name, Render, getKey }) => (
              <Render
                key={name}
                $$key={getKey({ data: part, prototype })}
                data={part}
                prototype={prototype}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}
