import { Colors } from '@circuit/shared';
import React from 'react';
import { IPartRendererProps } from '../../../../types';
import { ElectronicPoint as Point } from '../../../components';

export function Render({ data, prototype }: IPartRendererProps) {
  const { pins } = prototype;

  if (pins.length === 0) {
    return null;
  }

  const { connections = [] } = data;

  return (
    <>
      {pins.map(({ position }, index) => (
        <Point
          position={position}
          hoverR={5}
          normalR={connections[index] ? 0 : 1}
          duration={200}
          fill={connections[index] ? Colors.White.toString() : 'currentColor'}
        />
      ))}
    </>
  );
}
