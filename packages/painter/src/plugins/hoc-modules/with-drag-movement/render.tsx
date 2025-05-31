import { Point } from '@circuit/algorithm';
import React, { FC } from 'react';
import { usePainterService } from '../../../context';
import {
  PropsWithHocParams,
  VARIABLE_OBSERVER_SERVICE as VAR,
} from '../../../types';
import { MOVEMENT_HOC_SCOPE as KEY } from './constant';

export function MovementHOC(Render: FC<any>): FC<PropsWithHocParams<any>> {
  function Movement(props: PropsWithHocParams<any>) {
    const { $$key: key } = props;
    const { useVariable } = usePainterService(VAR);
    const movement = useVariable<Point>(KEY, key);
    const isMoving = (movement && !movement.isZero());

    return (
      <g transform={isMoving ? `translate(${movement.join()})` : undefined}>
        <Render {...props} />
      </g>
    );
  }

  return React.memo(Movement);
}
