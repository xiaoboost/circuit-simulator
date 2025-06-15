import { STATE_CORE_SERVICE } from '@circuit/shared';
import { stringifyClass as scl } from '@xiao-ai/utils';
import React from 'react';
import {
  useComposeHOC,
  useWatcher,
  useHook,
  useService,
} from '../../../../context';
import {
  IDrawLayerProps,
  PART_RENDERER,
  SELECT_SERVICE,
} from '../../../../types';
import * as Styles from './styles.less';

function PartLayerRender({ parts }: IDrawLayerProps) {
  const partRenderers = useHook(PART_RENDERER, 'asc');
  const partComposedRenderers = partRenderers.map(useComposeHOC);
  const service = useService(STATE_CORE_SERVICE);
  const selectService = useService(SELECT_SERVICE);
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
              const key = getKey?.(props) ?? part.id;

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
