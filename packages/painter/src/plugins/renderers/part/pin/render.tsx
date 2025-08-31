import React from 'react';
import { useService, useHook } from '../../../../context';
import {
  type IPartRendererProps,
  PIN_RENDERER,
  CONNECTION_SERVICE,
  IPinRendererProps,
} from '../../../../types';
import { Pin } from './pin';

function PartPinRender({ data: { id }, prototype: { pins }, style }: IPartRendererProps) {
  const { getConnections } = useService(CONNECTION_SERVICE);
  const pinRenderers = useHook(PIN_RENDERER);

  if (pins.length === 0 || pinRenderers.length === 0) {
    return null;
  }

  return pins.map(({ position }, index) => {
    const connections = getConnections(id, index);
    const isSpace = !connections || connections.length === 0;
    const key = `${id}-${index}`;
    const props: IPinRendererProps = {
      key,
      id: key,
      parentId: id,
      pinIndex: index,
      position: position,
      hoverR: 4,
      normalR: 0,
      style,
    };

    if (isSpace) {
      props.r = -1;
      props.fill = '#fff';
    }
    else {
      props.r = 2;
    }

    console.log('props', props);

    return <Pin {...props} />;
  });
}

export const Render = React.memo(PartPinRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
