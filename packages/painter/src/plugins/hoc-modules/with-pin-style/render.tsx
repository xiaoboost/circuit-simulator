import { IVariableObserverService as VAR } from '@circuit/contracts/painter';
import { PropsWithHocParams } from '@circuit/inject';
import React, { FC } from 'react';
import { useService } from '../../../context';
import { PIN_STYLE_HOC_SCOPE as KEY } from './constant';

export function PinStyleFactory(Render: FC<any>): FC<PropsWithHocParams<any>> {
  function PinStyleHOC(props: PropsWithHocParams<any>) {
    const { $$key: key } = props;
    const { useVariable } = useService(VAR);
    const style = useVariable(KEY, key);

    if (style) {
      return <Render {...props} {...style} />;
    }
    else {
      return <Render {...props} />;
    }
  }

  return React.memo(PinStyleHOC);
}
