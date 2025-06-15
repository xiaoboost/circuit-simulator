import { PropsWithHocParams } from '@circuit/inject';
import React, { FC, useMemo } from 'react';
import { useService } from '../../../context';
import { VARIABLE_OBSERVER_SERVICE as VAR } from '../../../types';
import { POINT_RADIUS_HOC_SCOPE as KEY } from './constant';

export function PinRadiusFactory(Render: FC<any>): FC<PropsWithHocParams<any>> {
  function PinRadiusHOC(props: PropsWithHocParams<any>) {
    const { $$key: key } = props;
    const { useVariable } = useService(VAR);
    const radius = useVariable<number>(KEY, key);
    const realRadius = useMemo(() => radius ? radius : props.r, [radius, props.r]);
    return <Render {...props} r={realRadius} />;
  }

  return React.memo(PinRadiusHOC);
}
