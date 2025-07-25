import React from 'react';
import { IPartRendererProps } from '../../../../types';

function PartBodyRender({ prototype, style }: IPartRendererProps) {
  return (
    <g style={style}>
      {prototype.shape.map(({ name: Tag, attribute }, index) => (
        <Tag key={index} {...attribute} />
      ))}
    </g>
  );
}

export const Render = React.memo(PartBodyRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
