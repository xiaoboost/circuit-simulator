import { Colors } from '@circuit/shared';
import React from 'react';
import { IPointRendererProps } from '../../../../types';
import { ElectronicPoint } from '../../../components';

export function Render({ data }: IPointRendererProps) {
  return (
    <ElectronicPoint
      position={data.position}
      fill={Colors.White.toString()}
      r={2}
    />
  );
}
