import React from 'react';
import styles from './styles.styl';

import { useWatcher } from 'src/use';
import { mapState } from '../drawing-sheet/map';
import { useState, useRef, useEffect } from 'react';
import { PointKind, PointStatus } from './constant';

export interface Props {
  kind: PointKind;
  status: PointStatus;
  size?: number;
  className?: string;
  transform?: string;
}

export function getStyle(kind: PointKind, status: PointStatus, isSelected = false) {
  const data: React.SVGProps<SVGCircleElement> = {};
  const classNameNormal = isSelected ? 'selected' : 'normal';

  let hollow: 'Hollow' | 'Solid' = 'Solid';

  if (kind === PointKind.Part) {
    hollow = 'Solid';
  }
  else if (kind === PointKind.Line) {
    hollow = 'Hollow';

    if (status === PointStatus.Open) {
      data.strokeDasharray = '1.5 4';
    }
  }
  else if (kind === PointKind.LineCross) {
    hollow = 'Solid';
  }

  data.className = styles[`${classNameNormal}${hollow}`];

  return data;
}

export function getSize(kind: PointKind, status: PointStatus, hover: boolean) {
  if (kind === PointKind.LineCross) {
    return hover ? 6 : 2;
  }
  else if (kind === PointKind.Part) {
    return status === PointStatus.Open
      ? hover ? 5 : 0
      : 2;
  }
  else if (kind === PointKind.Line) {
    return status === PointStatus.Close
      ? hover ? 8 : 4
      : 2;
  }

  return 0;
}


export function ElectronicPoint(props: Props) {
  const circle = useRef<SVGCircleElement>(null);
  const animate = useRef<SVGAnimationElement>(null);
  const [{ zoom }] = useWatcher(mapState);
  const [inner, setInner] = useState(0);
  const [actual, setActual] = useState(0);
  const [animateTo, setAnimateTo] = useState(0);
  const [animateFrom, setAnimateFrom] = useState(0);

  const size = props.size ?? -1;
  const circleProps = getStyle(props.kind, props.status);

  function setAnimate() {
    if (!circle.current || !animate.current) {
      return;
    }

    const rect = circle.current.getBoundingClientRect();
  
    // 计算当前值
    setAnimateFrom(rect ? rect.width / zoom / 2 : 0);
    // 确定新的终点值
    setAnimateTo(actual);
    // 动画启动
    animate.current.beginElement();
  }
  
  function onMouseEnter() {
    setInner(getSize(props.kind, props.status, true));
  }

  function onMouseLeave() {
    setInner(getSize(props.kind, props.status, false));
  }

  useEffect(() => {
    setActual(size >= 0 ? size : inner);
  }, [size, inner]);

  useEffect(() => setAnimate(), [actual]);
  useEffect(() => onMouseLeave(), []);

  return (
    <g
      transform={props.transform}
      className={props.className}
    >
      <circle
        ref={circle}
        cx='0'
        cy='0'
        {...circleProps}
        className={circleProps.className}
      >
        <animate
          ref={animate}
          fill='freeze'
          attributeType='XML'
          attributeName='r'
          begin='indefinite'
          calcMode='spline'
          keyTimes='0; 1'
          keySplines='.2 1 1 1'
          dur='200ms'
          values={`${animateFrom}; ${animateTo}`}>
        </animate>
      </circle>
      <rect
        x='-8.5'
        y='-8.5'
        height='17'
        width='17'
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </g>
  );
}
