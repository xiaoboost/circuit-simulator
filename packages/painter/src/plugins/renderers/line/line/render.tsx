import React from 'react';
import { ILineRendererProps } from '../../../../types';

export function Render({ data: { path } }: ILineRendererProps) {
  if (path.length === 0) {
    return null;
  }

  return (
    <path stroke='currentColor' d={`M${path.map((n) => n.join(',')).join('L')}`} />
  );
}
