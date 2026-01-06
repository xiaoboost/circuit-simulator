import { isEqualPoint } from '@circuit/algorithm';
import { ILineRendererProps } from '@circuit/contracts/painter';
import React from 'react';

function LinePathRender({ data: { path }, style }: ILineRendererProps) {
  if (path.length === 0) {
    return null;
  }

  return (
    <path
      stroke="currentColor"
      style={style}
      d={`M${path.map((n) => n.join(',')).join('L')}`}
    />
  );
}

export const Render = React.memo(
  LinePathRender,
  ({ data: { path: prevPath } }, { data: { path: nextPath } }) => (
    prevPath.length === nextPath.length
    && prevPath.every((prevPoint, index) => isEqualPoint(prevPoint, nextPath[index]))
  ),
);
