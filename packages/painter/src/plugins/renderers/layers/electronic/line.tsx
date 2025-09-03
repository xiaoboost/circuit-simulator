import { IRendererHOC } from '@circuit/shared';
import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useMemo } from 'react';
import {
  composeHOC,
  useWatcher,
  useHook,
  useService,
} from '../../../../context';
import {
  ILineRendererHook,
  ISelectService,
  ILineRendererProps,
} from '../../../../types';
import * as Styles from './styles.less';

export const Line = React.memo(function Line({ data }: ILineRendererProps) {
  const selectService = useService(ISelectService);
  const lineRenderers = useHook(ILineRendererHook, 'asc');
  const hocHooks = useHook(IRendererHOC, 'asc');
  const [selectedIds] = useWatcher(selectService.value);

  // 如果导线没有渲染器，则不渲染
  if (lineRenderers.length === 0) {
    return null;
  }

  const lineComponents = useMemo(
    () => lineRenderers.map((core) => composeHOC(core, hocHooks)),
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
