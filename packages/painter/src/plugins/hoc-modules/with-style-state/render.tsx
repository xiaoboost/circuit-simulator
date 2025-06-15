import { PropsWithHocParams } from '@circuit/inject';
import React, { FC, useMemo } from 'react';
import { useService } from '../../../context';
import { VARIABLE_OBSERVER_SERVICE as VAR } from '../../../types';
import { STYLE_HOC_SCOPE as KEY } from './constant';

export function StyleFactory(Render: FC<any>): FC<PropsWithHocParams<any>> {
  function StyleHOC(props: PropsWithHocParams<any>) {
    const { $$key: key } = props;
    const { useVariable } = useService(VAR);
    const varStyle = useVariable<React.CSSProperties>(KEY, key);
    const mergedStyle = useMemo(() => {
      return varStyle
        ? { ...props.style, ...varStyle }
        : props.style;
    }, [props.style, varStyle]);

    return <Render {...props} style={mergedStyle} />;
  }

  return React.memo(StyleHOC);
}
