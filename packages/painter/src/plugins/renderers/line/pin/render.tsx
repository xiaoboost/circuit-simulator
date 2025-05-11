import { Colors } from '@circuit/shared';
import React from 'react';
import { ILineRendererProps } from '../../../../types';
import { ElectronicPoint } from '../../../components';

export function Render({ data: { path, connections } }: ILineRendererProps) {
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
        const connect = connections?.[i];
        const isSpace = !connect || connect.length === 0;

        return (
          <ElectronicPoint
            position={position}
            normalR={isSpace ? 2 : 1}
            fill={isSpace ? Colors.White.toString() : 'currentColor'}
          />
        );
      })}
    </>
  );
}
