import React from 'react';

import { Point } from '@circuit/math';
import { delay } from '@xiao-ai/utils';
import { useEffect, useState, useRef } from 'react';
import { modalStyles as styles, StyleProps, AnimationStatus, transformTime } from './styles';

interface Props {
  visible: boolean;
  position: Point;
}

/** 设置对话框显示动画 */
async function setDialogVisible(
  dom: HTMLDivElement,
  position: Point,
  set: (data: StyleProps) => any,
) {
  const getStyle = (rect?: DOMRect) => ({
    isEnter: true,
    partPosition: position,
    dialogRect: rect ?? {
      height: 0,
      width: 0,
    },
  });

  set({
    ...getStyle(),
    status: AnimationStatus.Before,
  });

  await delay();

  const rect = dom.getBoundingClientRect();

  set({
    ...getStyle(rect),
    status: AnimationStatus.Start,
  });

  await delay(20);

  set({
    ...getStyle(rect),
    status: AnimationStatus.Active,
  });

  await delay(transformTime);

  set({
    ...getStyle(rect),
    status: AnimationStatus.After,
  });

  await delay();

  set({
    ...getStyle(rect),
    status: AnimationStatus.End,
  });
}

/** 设置对话框消失动画 */
async function setDialogDisappear(
  last: StyleProps,
  set: (data: StyleProps) => any,
) {
  set({
    ...last,
    isEnter: false,
    status: AnimationStatus.Before,
  });

  await delay();

  set({
    ...last,
    isEnter: false,
    status: AnimationStatus.Active,
  });

  await delay(transformTime);

  set({
    ...last,
    isEnter: false,
    status: AnimationStatus.End,
  });
}

export function Modal(props: React.PropsWithChildren<Props>) {
  const dialogEl = useRef<HTMLDivElement>(null);
  const [styleStatus, setStyleStatus] = useState<StyleProps>({
    isEnter: true,
    status: AnimationStatus.End,
    partPosition: new Point(1e6, 1e6),
    dialogRect: {
      height: 0,
      width: 0,
    },
  });
  const classNames = styles(styleStatus);

  useEffect(() => {
    if (props.visible) {
      setDialogVisible(dialogEl.current!, props.position, setStyleStatus);
    }
    else {
      setDialogDisappear(styleStatus, setStyleStatus);
    }
  }, [props.visible]);

  return <div className={classNames.boxWrapper}>
    <div className={classNames.boxMask} />
    <div ref={dialogEl} className={classNames.box}>
      {props.children}
    </div>
  </div>;
}
