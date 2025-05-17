
import { Position, Point } from '@circuit/algorithm';
import React, { useState, useRef, useEffect } from 'react';
import { usePainterService } from '../../../context';
import { MAP_COORDINATE_SERVICE } from '../../../types';
import { focus } from './styles.css';

export interface ElectronicPointProps extends React.SVGProps<SVGCircleElement> {
  /** 节点相对于图纸原点位置 */
  position: Point | Position
  /**
   * 半径
   *
   * @description 优先级最高
   * @default `-1`
   */
  r?: number;
  /**
   * 悬停半径
   *
   * @description 悬停时半径，优先级次高
   * @default `5`
   */
  hoverR?: number;
  /**
   * 闲置半径
   *
   * @description 闲置时半径，优先级次高
   * @default `0`
   */
  normalR?: number;
  /**
   * 动画持续时间
   *
   * @description 动画持续时间，单位为毫秒
   * @default `200`
   */
  duration?: number;
  /** 点击事件 */
  onMouseDown?: (ev: React.MouseEvent) => any;
}

export function ElectronicPoint(props: ElectronicPointProps) {
  const circle = useRef<SVGCircleElement>(null);
  const animate = useRef<SVGAnimationElement>(null);
  const { value: { data: { scale } } } = usePainterService(MAP_COORDINATE_SERVICE);
  const [inner, setInner] = useState(0);
  const [actual, setActual] = useState(0);
  const [animateTo, setAnimateTo] = useState(0);
  const [animateStart, setAnimateStart] = useState(0);
  const {
    className,
    style,
    position,
    r: size = -1,
    hoverR = 5,
    normalR = 0,
    duration = 200,
    onMouseDown,
    ...rest
  } = props;

  function setAnimate() {
    if (!circle.current || !animate.current) {
      return;
    }

    const circleRect = circle.current.getBoundingClientRect();

    // 计算当前值
    setAnimateStart(circleRect ? circleRect.width / scale / 2 : 0);
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

  function getSize(isHover: boolean) {
    return isHover ? hoverR : normalR;
  }

  // 设置初始值
  useEffect(() => {
    onMouseLeave();
  }, []);

  useEffect(() => {
    setActual(size >= 0 ? size : inner);
  }, [size, inner]);

  useEffect(setAnimate, [actual]);

  return (
    <g
      className={className}
      style={style}
      transform={`translate(${position.join()})`}
      {...rest}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
    >
      <circle
        cx='0'
        cy='0'
        ref={circle}
        stroke='currentColor'
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
          dur={`${duration}ms`}
          values={`${animateStart}; ${animateTo}`}>
        </animate>
      </circle>
      <rect
        x='-8.5'
        y='-8.5'
        height='17'
        width='17'
        className={focus}
      />
    </g>
  );
}
