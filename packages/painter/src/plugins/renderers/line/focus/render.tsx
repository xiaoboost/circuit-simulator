import { isEqualPoint } from '@circuit/algorithm';
import React from 'react';
import { usePainterService } from '../../../../context';
import { ILineRendererProps } from '../../../../types';
import * as Styles from './styles.less';
import { getLineRect } from './utils';

function LineFocusRender({ data: { path } }: ILineRendererProps) {
  return (
    <g className={Styles.focus}>
      {getLineRect(path).map((rect, i) => (
        <rect key={i} {...rect} />
      ))}
    </g>
  );
}

export const Render = React.memo(
  LineFocusRender,
  ({ data: { path: prevPath } }, { data: { path: nextPath } }) => (
    prevPath.length === nextPath.length &&
    prevPath.every((prevPoint, index) => isEqualPoint(prevPoint, nextPath[index]))
  ),
);
