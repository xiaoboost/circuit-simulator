import React from 'react';

import { useWatcher } from '@xiao-ai/utils/use';
import { Map } from 'src/store';
import { styles as pointStyles } from './styles';
import { ElectronicPointKind } from './types';
import { useState, useRef, useEffect } from 'react';
import { MouseFocusClassName } from '@circuit/electronics';
import { Point } from '@circuit/math';

export interface ElectronicPointProps {
  /** 节点状态 */
  kind: ElectronicPointKind;
  /** 节点相对于图纸原点位置 */
  position: Point;
  /** 节点半径 */
  size?: number;
  /** 点击节点 */
  onMouseDown?: (ev: React.MouseEvent) => any;
}

export function ElectronicPoint(props: ElectronicPointProps) {
  const circle = useRef<SVGCircleElement>(null);
  const animate = useRef<SVGAnimationElement>(null);
  const [{ zoom }] = useWatcher(Map.state);
  const [inner, setInner] = useState(0);
  const [actual, setActual] = useState(0);
  const [animateTo, setAnimateTo] = useState(0);
  const [animateFrom, setAnimateFrom] = useState(0);
  const {
    kind,
    position,
    size = -1,
    onMouseDown
  } = props;

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

    if (kind === ElectronicPointKind.PartPin || kind === ElectronicPointKind.PartPinLine) {
      data.className = pointStyles.solidCircle;
    }
    // else {
    //   data.className = kind === ConnectionStatus.Space
    //     ? pointStyles.dashCircle
    //     : pointStyles.solidCircle;
    // }

    return data;
  }

  function getSize(hover: boolean) {
    if (kind === ElectronicPointKind.PartPin) {
      return hover ? 5: 0;
    }
    else if (kind === ElectronicPointKind.PartPinLine) {
      return 2;
    }
    else if (kind === ElectronicPointKind.Line) {
      return hover ? 8 : 4;
    }
    else if (kind === ElectronicPointKind.LineCross) {
      return hover ? 6 : 2;
    }
    // TODO: 交叠节点
    else {
      return 2;
    }
  }

  useEffect(() => {
    setActual(size >= 0 ? size : inner);
  }, [size, inner]);

  useEffect(() => setAnimate(), [actual]);
  useEffect(() => onMouseLeave(), [kind]);

  return (
    <g
      transform={`translate(${position.join()})`}
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
        onMouseDown={onMouseDown}
      />
    </g>
  );
}
