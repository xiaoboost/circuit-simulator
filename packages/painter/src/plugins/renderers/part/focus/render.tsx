import React from 'react';
import { IPartRendererProps } from '../../../../types';
import { focus } from './styles.css';

export function Render({ prototype }: IPartRendererProps) {
  return (
    <g className={focus}>
      {prototype.focus.map(({ name: Tag, attribute }, index) => (
        <Tag key={index} {...attribute} />
      ))}
    </g>
  );
}
