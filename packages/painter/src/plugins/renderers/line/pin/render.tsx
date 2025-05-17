import { Colors } from '@circuit/shared';
import React from 'react';
import { usePainterService } from '../../../../context';
import { ILineRendererProps, MAP_SERVICE_KEY } from '../../../../types';
import { ElectronicPoint } from '../../../components';

export function Render({ data: { id, path } }: ILineRendererProps) {
  const { getPinConnectionByPin } = usePainterService(MAP_SERVICE_KEY);

  if (path.length === 0) {
    return null;
  }

  const pins = [path[0], path[path.length - 1]];

  if (pins[0][0] === pins[1][0] && pins[0][1] === pins[1][1]) {
    pins.pop();
  }

  return (
    <>
      {pins.map((position, i) => {
        const connections = getPinConnectionByPin(id, i);
        const isSpace = connections.length === 0;

        return (
          <ElectronicPoint
            key={i}
            position={position}
            hoverR={isSpace ? 5: 4}
            normalR={isSpace ? 2 : 1}
            fill={isSpace ? Colors.White.toString() : 'currentColor'}
          />
        );
      })}
    </>
  );
}
