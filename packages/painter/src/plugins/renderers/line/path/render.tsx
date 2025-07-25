import { isEqualPoint } from '@circuit/algorithm';
import React from 'react';
import { ILineRendererProps } from '../../../../types';

function LinePathRender({ data: { path }, style }: ILineRendererProps) {
  if (path.length === 0) {
    return null;
  }

  return (
    <path
      stroke='currentColor'
      style={style}
      d={`M${path.map((n) => n.join(',')).join('L')}`}
    />
  );
}

export const Render = React.memo(
  LinePathRender,
  ({ data: { path: prevPath } }, { data: { path: nextPath } }) => (
    prevPath.length === nextPath.length &&
    prevPath.every((prevPoint, index) => isEqualPoint(prevPoint, nextPath[index]))
  ),
);
