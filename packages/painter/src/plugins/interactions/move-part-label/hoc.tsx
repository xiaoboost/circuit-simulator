import { Point, Position } from '@circuit/algorithm';
import React, { useEffect, useMemo, useRef } from 'react';
import { usePainterService } from '../../../context';
import { HOC, VARIABLE_OBSERVER_SERVICE } from '../../../types';
import { MOVE_PART_LABEL_HOC_KEY } from './constant';

interface MoveHOCProps {
  position: Position;
}

export const MovePartLabelHOC: HOC<MoveHOCProps> = (Renderer) => {
  return function MovePartLabel(props) {
    const { $$key: key } = props;
    const { useVariable } = usePainterService(VARIABLE_OBSERVER_SERVICE);
    const movementRef = useRef<SVGGElement>(null);
    const transformText = useRef('');
    const movement = useVariable<Point>(MOVE_PART_LABEL_HOC_KEY, key);
    const newProps = useMemo(() => ({
      ...props,
      ref: movementRef,
    }), [props]);

    useEffect(() => {
      if (!movementRef.current || !movement || movement.isZero()) {
        // 清空文本缓存
        if (transformText.current) {
          transformText.current = '';
        }

        return;
      }

      if (!transformText.current) {
        transformText.current = movementRef.current.getAttribute('transform') ?? '';
      }

      movementRef.current.setAttribute(
        'transform',
        `${transformText.current} translate(${movement.join()})`,
      );
    }, [movement, movementRef.current]);

    return <Renderer {...newProps} />;
  };
};
