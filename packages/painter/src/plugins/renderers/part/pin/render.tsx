import React from 'react';
import { usePainterService } from '../../../../context';
import { IPartRendererProps, MAP_SERVICE } from '../../../../types';
import { ElectronicPoint as Point } from '../../../components';

function PartPinRender({ data, prototype }: IPartRendererProps) {
  const { pins } = prototype;
  const { getPinConnectionByPin } = usePainterService(MAP_SERVICE);

  if (pins.length === 0) {
    return null;
  }

  return (
    <>
      {pins.map(({ position }, index) => {
        const connections = getPinConnectionByPin(data.id, index);
        const isSpace = !connections || connections.length === 0;

        return (
          <Point
            key={index}
            position={position}
            hoverR={4}
            normalR={0}
            fill={isSpace ? '#fff' : undefined}
          />
        );
      })}
    </>
  );
}

export const Render = React.memo(PartPinRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
