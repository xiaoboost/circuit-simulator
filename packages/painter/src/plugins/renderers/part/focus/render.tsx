import React from 'react';
import { IPartRendererProps } from '../../../../types';
import { focus } from './styles.css';

function PartFocusRender({ prototype }: IPartRendererProps) {
  return (
    <g className={focus}>
      {prototype.focus.map(({ name: Tag, attribute }, index) => (
        <Tag key={index} {...attribute} />
      ))}
    </g>
  );
}

export const Render = React.memo(PartFocusRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
