import { Point } from '@circuit/algorithm';
import { PropsWithHocParams } from '@circuit/inject';
import React, { FC } from 'react';
import { useService } from '../../../context';
import { IVariableObserverService as VAR } from '../../../types';
import { MOVEMENT_HOC_SCOPE as KEY } from './constant';

export function MovementFactory(Render: FC<any>): FC<PropsWithHocParams<any>> {
  function MovementHOC(props: PropsWithHocParams<any>) {
    const { $$key: key } = props;
    const { useVariable } = useService(VAR);
    const movement = useVariable<Point>(KEY, key);
    const transform = movement && !movement.isZero() ? `translate(${movement.join()})` : '';

    return (
      <g transform={transform}>
        <Render {...props} />
      </g>
    );
  }

  return React.memo(MovementHOC);
}
