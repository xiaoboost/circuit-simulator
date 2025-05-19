import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import { useWatcher, usePainterHook, usePainterService } from '../../../../context';
import { composeHOC } from '../../../../context/utils';
import {
  IDrawLayerProps,
  PART_RENDERER,
  PAINTER_SERVICE_KEY,
  RENDERER_HOC,
  SELECT_SERVICE,
} from '../../../../types';
import { selected } from './styles.css';

function PartLayerRender({ parts }: IDrawLayerProps) {
  const partRenderers = usePainterHook(PART_RENDERER, 'asc');
  const service = usePainterService(PAINTER_SERVICE_KEY);
  const HocHooks = usePainterHook(RENDERER_HOC, 'desc');
  const selectService = usePainterService(SELECT_SERVICE);
  const [selectedIds] = useWatcher(selectService.value);

  if (partRenderers.length === 0) {
    return null;
  }

  return (
    <>
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
            {partRenderers.map((Render) => (
              composeHOC({ data: part, prototype }, Render, HocHooks)
            ))}
          </g>
        );
      })}
    </>
  );
}

export const Render = React.memo(
  PartLayerRender,
  ({ parts: prev }, { parts: next }) => (
    prev.length === next.length &&
    prev.every((part, i) => part === next[i])
  ),
);
