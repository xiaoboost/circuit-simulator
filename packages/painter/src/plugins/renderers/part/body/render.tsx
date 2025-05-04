import React from 'react';
import { IPartRendererProps } from '../../../../types';

export function Render({ prototype }: IPartRendererProps) {
  return (
    <g>
      {prototype.shape.map(({ name: Tag, attribute }, index) => (
        <Tag key={index} {...attribute} />
      ))}
    </g>
  );
}
