import { IRendererHOC } from '@circuit/contracts/global';
import {
  IPartRendererHook,
  ISelectService,
  IPartRendererProps,
} from '@circuit/contracts/painter';
import { useWatcher } from '@circuit/reactive';
import { stringifyClass as scl } from '@xiao-ai/utils';
import React, { useMemo } from 'react';
import {
  composeHOC,
  useHook,
  useService,
} from '../../../../context';
import * as Styles from './styles.less';

export const Part = React.memo(function Part({ data, prototype }: IPartRendererProps) {
  const selectService = useService(ISelectService);
  const partRenderers = useHook(IPartRendererHook, 'asc');
  const hocHooks = useHook(IRendererHOC, 'asc');
  const [selectedIds] = useWatcher(selectService.value);

  // 如果元件没有渲染器，则不渲染
  if (partRenderers.length === 0) {
    return null;
  }

  const partComponents = useMemo(
    () => partRenderers.map((core) => composeHOC(core, hocHooks)),
    [partRenderers, hocHooks],
  );

  return (
    <g
      transform={`matrix(${data.rotate.join()},${data.position.join()})`}
      className={scl({
        [Styles.selected]: selectedIds.has(data.id),
      })}
    >
      {partComponents.map(({ Component, getKey }) => {
        const key = getKey?.({ data, prototype }) ?? data.id;
        return <Component key={key} $$key={key} data={data} prototype={prototype} />;
      })}
    </g>
  );
});
