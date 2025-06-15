import { Path } from '@circuit/algorithm';
import { PropsWithHocParams } from '@circuit/inject';
import React, { FC, useMemo } from 'react';
import { useService } from '../../../context';
import { VARIABLE_OBSERVER_SERVICE as VAR } from '../../../types';
import { PATH_DISTORTION_HOC_SCOPE as KEY } from './constant';

export function PathDistortionFactory(Render: FC<any>): FC<PropsWithHocParams<any>> {
  function PathDistortionHOC(props: PropsWithHocParams<any>) {
    const { $$key: key } = props;
    const { useVariable } = useService(VAR);
    const path = useVariable<Path>(KEY, key);
    const realPath = useMemo(() => path ? path : props.path, [path, props.path]);
    return <Render {...props} path={realPath} />;
  }

  return React.memo(PathDistortionHOC);
}
