import React from 'react';

import { moveStyle } from './styles';
import { delay } from '@xiao-ai/utils';
import { PropsWithChildren, useState, useEffect } from 'react';
import { tabWidth, panelWidth, animateTime } from '../constant';

interface Props {
  visible: boolean;
}

export function Move(props: PropsWithChildren<Props>) {
  const [visible, setVisible] = useState(props.visible);
  const [inAnimate, setInAnimate] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    async function animate() {
      const startStyle = {
        right: tabWidth - panelWidth,
        opacity: 0,
      };
      const endStyle = {
        right: tabWidth,
        opacity: 1,
      };

      setInAnimate(true);
      setStyle(props.visible ? startStyle : endStyle);
      await delay(10);
      setStyle(props.visible ? endStyle : startStyle);
      await delay(animateTime);
      setVisible(props.visible);
      setInAnimate(false);
    }
    
    if (visible === props.visible) {
      return;
    }

    animate();
  }, [props.visible]);

  // 静止状态
  if (!inAnimate) {
    return visible ? <>{props.children}</> : <></>;
  }

  return <div className={moveStyle.container} style={style}>
    {props.children}
  </div>;
}
