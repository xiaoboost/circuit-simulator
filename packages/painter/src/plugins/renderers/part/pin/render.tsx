import { Colors } from '@circuit/shared';
import React from 'react';
import { IPartRendererProps } from '../../../../types';
import { ElectronicPoint as Point } from '../../../components';

export function Render({ data, prototype }: IPartRendererProps) {
  const { pins } = prototype;

  if (pins.length === 0) {
    return null;
  }

  // FIXME: 连接关系待修改
  // const { connections = [] } = data;

  return (
    <>
      {pins.map(({ position }, index) => (
        // <Point
        //   position={position}
        //   hoverR={5}
        //   normalR={connections[index] ? 0 : 1}
        //   duration={200}
        //   fill={connections[index] ? Colors.White.toString() : 'currentColor'}
        // />
        <Point
          position={position}
          hoverR={5}
          normalR={0}
          duration={200}
          fill={Colors.White.toString()}
        />
      ))}
    </>
  );
}
