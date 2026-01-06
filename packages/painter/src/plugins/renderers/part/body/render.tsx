import { IPartRendererProps } from '@circuit/contracts/painter';
import React from 'react';

function PartBodyRender({ prototype }: IPartRendererProps) {
  return prototype.shape.map(({ name: Tag, attribute }, index) => (
    <Tag key={index} {...attribute} />
  ));
}

export const Render = React.memo(PartBodyRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
