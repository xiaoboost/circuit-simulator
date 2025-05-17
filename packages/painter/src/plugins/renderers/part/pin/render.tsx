import { Colors } from '@circuit/shared';
import React from 'react';
import { usePainterService } from '../../../../context';
import { IPartRendererProps, MAP_SERVICE_KEY } from '../../../../types';
import { ElectronicPoint as Point } from '../../../components';

export function Render({ data, prototype }: IPartRendererProps) {
  const { pins } = prototype;
  const { getPinConnectionByPin } = usePainterService(MAP_SERVICE_KEY);

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
            hoverR={5}
            normalR={isSpace ? 0 : 1}
            duration={200}
            fill={isSpace ? Colors.White.toString() : undefined}
          />
        );
      })}
    </>
  );
}
