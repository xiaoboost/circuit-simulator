import { Point } from '@circuit/algorithm';
import { PropsWithHocParams } from '@circuit/inject';
import React, { FC, useMemo, CSSProperties } from 'react';
import { useService } from '../../../context';
import { VARIABLE_OBSERVER_SERVICE as VAR } from '../../../types';
import { MOVEMENT_HOC_SCOPE as KEY } from './constant';

export function MovementFactory(Render: FC<any>): FC<PropsWithHocParams<any>> {
  function MovementHOC(props: PropsWithHocParams<any>) {
    const { $$key: key } = props;
    const { useVariable } = useService(VAR);
    const movement = useVariable<Point>(KEY, key);
    const mergedStyle = useMemo((): CSSProperties => {
      return (movement && !movement.isZero())
        ? {
          ...props.style,
          // 合并 transform 属性
          transform: [props.style.transform, `translate(${movement.join()})`].join(' '),
        }
        : props.style;
    }, [props.style, movement]);

    return <Render {...props} style={mergedStyle} />;
  }

  return React.memo(MovementHOC);
}
