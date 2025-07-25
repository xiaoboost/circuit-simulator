import { RENDERER_HOC } from '@circuit/shared';
import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useMemo } from 'react';
import {
  composeHOC,
  useWatcher,
  useHook,
  useService,
} from '../../../../context';
import {
  LINE_RENDERER,
  SELECT_SERVICE,
  ILineRendererProps,
} from '../../../../types';
import * as Styles from './styles.less';

export const Line = React.memo(function Line({ data }: ILineRendererProps) {
  const selectService = useService(SELECT_SERVICE);
  const lineRenderers = useHook(LINE_RENDERER, 'asc');
  const hocHooks = useHook(RENDERER_HOC, 'asc');
  const [selectedIds] = useWatcher(selectService.value);

  // 如果导线没有渲染器，则不渲染
  if (lineRenderers.length === 0) {
    return null;
  }

  const lineComponents = useMemo(
    () => lineRenderers.map(core => composeHOC(core, hocHooks)),
    [lineRenderers, hocHooks],
  );

  return (
    <g
      className={scl({
        [Styles.selected]: selectedIds.has(data.id),
      })}
    >
      {lineComponents.map(({ Component, getKey }) => {
        const key = getKey?.({ data }) ?? data.id;
        return <Component key={key} $$key={key} data={data} />;
      })}
    </g>
  );
});
