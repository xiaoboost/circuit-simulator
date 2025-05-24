import React from 'react';
import { IPartRendererProps } from '../../../../types';
import * as Styles from './styles.less';

function PartFocusRender({ prototype }: IPartRendererProps) {
  return (
    <g className={Styles.focus}>
      {prototype.focus.map(({ name: Tag, attribute }, index) => (
        <Tag key={index} {...attribute} />
      ))}
    </g>
  );
}

export const Render = React.memo(PartFocusRender, ({ data: prev }, { data: next }) => {
  return prev.kind === next.kind;
});
