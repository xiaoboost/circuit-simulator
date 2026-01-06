import { IRendererHOC } from '@circuit/contracts/global';
import { IPinRendererHook, IPinRendererProps } from '@circuit/contracts/painter';
import React, { useMemo } from 'react';
import { composeHOC, useHook } from '../../../../context';

export const Pin = React.memo(function Pin(props: IPinRendererProps) {
  const pinRenderers = useHook(IPinRendererHook, 'asc');
  const hocHooks = useHook(IRendererHOC, 'asc');

  // 如果引脚没有渲染器，则不渲染
  if (pinRenderers.length === 0) {
    return null;
  }

  const pinComponents = useMemo(
    () => pinRenderers.map((core) => composeHOC(core, hocHooks)),
    [pinRenderers, hocHooks],
  );

  return pinComponents.map(({ Component, getKey }) => {
    const key = getKey?.(props) ?? props.id;
    return <Component key={key} $$key={key} {...props} />;
  });
});
