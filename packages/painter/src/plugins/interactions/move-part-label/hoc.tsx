import { Point } from '@circuit/algorithm';
import React from 'react';
import { usePainterService } from '../../../context';
import { HOC, VARIABLE_OBSERVER_SERVICE as VAR, PropsWithRendererKey } from '../../../types';
import { MOVE_PART_LABEL_HOC_KEY as KEY } from './constant';

export const MovePartLabelHOC: HOC<PropsWithRendererKey> = (Renderer) => {
  return function MovePartLabel(props) {
    const { $$key: key } = props;
    const { useVariable } = usePainterService(VAR);
    const movement = useVariable<Point>(KEY, key);
    const isMoving = (movement && !movement.isZero());

    return (
      <g transform={isMoving ? `translate(${movement.join()})` : undefined}>
        <Renderer {...props} />
      </g>
    );
  };
};
