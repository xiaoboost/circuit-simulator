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
  LINE_RENDERER,
  SELECT_SERVICE,
} from '../../../../types';
import * as Styles from './styles.less';

function LineLayerRender({ lines }: IDrawLayerProps) {
  const lineRenderers = usePainterHook(LINE_RENDERER, 'asc');
  const lineComposedRenderers = lineRenderers.map(useComposeHOC);
  const selectService = usePainterService(SELECT_SERVICE);
  const [selectedIds] = useWatcher(selectService.value);

  if (lineComposedRenderers.length === 0) {
    return null;
  }

  return (
    <>
      {lines.map((line, index) => (
        <g
          key={line.id ?? index}
          className={scl({
            [Styles.selected]: selectedIds.has(line.id),
          })}
        >
          {lineComposedRenderers.map(({ Component, getKey }) => {
            const props = { data: line };
            const key = getKey(props);
            return <Component key={key} $$key={key} {...props} />;
          })}
        </g>
      ))}
    </>
  );
}

export const Render = React.memo(
  LineLayerRender,
  ({ lines: prev }, { lines: next }) => (
    prev.length === next.length &&
    prev.every((line, i) => line === next[i])
  ),
);
