import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import {
  useComposeHOC,
  useWatcher,
  usePainterHook,
  usePainterService,
} from '../../../../context';
import {
  IDrawLayerProps,
  PART_RENDERER,
  PAINTER_SERVICE,
  SELECT_SERVICE,
} from '../../../../types';
import * as Styles from './styles.less';

function PartLayerRender({ parts }: IDrawLayerProps) {
  const partRenderers = usePainterHook(PART_RENDERER, 'asc');
  const partComposedRenderers = partRenderers.map(useComposeHOC);
  const service = usePainterService(PAINTER_SERVICE);
  const selectService = usePainterService(SELECT_SERVICE);
  const [selectedIds] = useWatcher(selectService.value);

  if (partComposedRenderers.length === 0) {
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
              [Styles.selected]: selectedIds.has(part.id),
            })}
          >
            {partComposedRenderers.map(({ Component, getKey }) => {
              const props = {
                data: part,
                prototype,
              };
              const key = getKey(props);

              return <Component key={key} $$key={key} {...props} />;
            })}
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
