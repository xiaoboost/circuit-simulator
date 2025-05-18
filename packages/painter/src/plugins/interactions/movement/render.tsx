import { Point } from '@circuit/algorithm';
import React from 'react';
import { usePainterService } from '../../../context';
import { isPropsEqual } from '../../../context/utils';
import { PropsWithHocParams, VARIABLE_OBSERVER_SERVICE as VAR } from '../../../types';
import { MOVEMENT_HOC_KEY as KEY } from './constant';

function Movement(props: PropsWithHocParams<any>) {
  const { $$key: key, children } = props;
  const { useVariable } = usePainterService(VAR);
  const movement = useVariable<Point>(KEY, key);
  const isMoving = (movement && !movement.isZero());

  return (
    <g transform={isMoving ? `translate(${movement.join()})` : undefined}>
      {children}
    </g>
  );
}

export const MovementRender = React.memo(
  Movement,
  (prev, next) => (
    prev.$$key === next.$$key &&
    isPropsEqual(prev.children, next.children)
  ),
);
