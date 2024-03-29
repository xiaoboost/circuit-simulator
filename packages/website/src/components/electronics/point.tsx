import React from 'react';

import { useWatcher } from '@xiao-ai/utils/use';
import { mapState } from '../drawing-sheet/map';
import { pointStyles } from './styles';
import { PointKind } from './constant';
import { useState, useRef, useEffect } from 'react';
import { MouseFocusClassName, ConnectionStatus } from '@circuit/electronics';
import { Point } from '@circuit/math';

interface Props {
  kind: PointKind;
  status: ConnectionStatus;
  position: Point;
  size?: number;
  onMouseDown?: (ev: React.MouseEvent) => any;
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
    setInner(getSize(true));
  }

  function onMouseLeave() {
    setInner(getSize(false));
  }

  function getCircleStyle() {
    const data: React.SVGProps<SVGCircleElement> = {};

    if (props.kind === PointKind.Part) {
      data.className = pointStyles.solidCircle;
    }
    else {
      data.className = props.status === ConnectionStatus.Space
        ? pointStyles.dashCircle
        : pointStyles.solidCircle;
    }

    return data;
  }

  function getSize(hover: boolean) {
    if (props.kind === PointKind.Part) {
      return props.status === ConnectionStatus.Space
        ? hover ? 5 : 0
        : 2;
    }
    else {
      if (props.status === ConnectionStatus.Space) {
        return hover ? 8 : 4;
      }
      else if (props.status === ConnectionStatus.Line) {
        return hover ? 6 : 2;
      }
      else {
        return 2;
      }
    }
  }

  useEffect(() => {
    setActual(size >= 0 ? size : inner);
  }, [size, inner]);

  useEffect(() => setAnimate(), [actual]);
  useEffect(() => onMouseLeave(), [props.status, props.kind]);

  return (
    <g
      transform={`translate(${props.position.join()})`}
      className={pointStyles.point}
    >
      <circle
        cx='0'
        cy='0'
        ref={circle}
        {...getCircleStyle()}
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
        className={MouseFocusClassName}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={props.onMouseDown}
      />
    </g>
  );
}
