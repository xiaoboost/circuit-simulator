import { Path } from '@circuit/algorithm';
import { PropsWithHocParams } from '@circuit/inject';
import React, { FC } from 'react';
import { useService } from '../../../context';
import { IVariableObserverService as VAR } from '../../../types';
import { PATH_DISTORTION_HOC_SCOPE as KEY } from './constant';

export function PathDistortionFactory(Render: FC<any>): FC<PropsWithHocParams<any>> {
  function PathDistortionHOC(props: PropsWithHocParams<any>) {
    const { $$key: key } = props;
    const { useVariable } = useService(VAR);
    const path = useVariable<Path>(KEY, key);

    if (path) {
      return <Render {...props} data={{ ...props.data, path }} />;
    }
    else {
      return <Render {...props} />;
    }
  }

  return React.memo(PathDistortionHOC);
}
