import { Point, Position } from '@circuit/algorithm';
import React, { useMemo } from 'react';
import { usePainterService } from '../../../context';
import { HOC, VARIABLE_OBSERVER_SERVICE } from '../../../types';
import { MOVE_HOC_KEY } from './constant';

interface MoveHOCProps {
  position: Position;
}

export const MoveHOC: HOC<MoveHOCProps> = (Renderer) => {
  return (props) => {
    const { $$key: key } = props;
    const { useVariable } = usePainterService(VARIABLE_OBSERVER_SERVICE);
    const movement = useVariable<Point>(MOVE_HOC_KEY, key);
    const newProps =useMemo(() => {
      if (movement.isZero()) {
        return props;
      }

      return {
        ...props,
        position: movement.add(props.position).toData(),
      };
    }, [movement, props.position]);

    return <Renderer {...newProps} />;
  };
};
