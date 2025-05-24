import { Position, Point } from '@circuit/algorithm';
import React, { useState, useRef, useEffect } from 'react';
import * as Styles from './styles.less';

export interface ElectronicPointProps extends React.SVGProps<SVGCircleElement> {
  /**
   * 节点位置
   *
   * @description 这个位置是相对哪里的需要看 DOM 结构
   */
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
  const [actual, setActual] = useState(0);
  const {
    className,
    style,
    position,
    r: size = -1,
    hoverR = 5,
    normalR = 0,
    duration = 200,
    onMouseDown,
    fill = 'currentColor',
    ...rest
  } = props;

  function triggerAnimation(targetR: number) {
    if (!circle.current || !animate.current) {
      return;
    }

    const currentR = parseFloat(circle.current.getAttribute('r')!) ?? 0;

    // 直接设置动画参数
    animate.current.setAttribute('values', `${currentR};${targetR}`);
    animate.current.beginElement();
  }

  function handleHover(isHover: boolean) {
    const newSize = isHover ? hoverR : normalR;
    const targetR = size >= 0 ? size : newSize;

    setActual(targetR);
    triggerAnimation(targetR);
  }

  useEffect(() => {
    // 初始化设置
    const initialSize = size >= 0 ? size : normalR;
    setActual(initialSize);
    if (circle.current) {
      circle.current.setAttribute('r', initialSize.toString());
    }
  }, []);

  // 显式设置 r 值，此时需要强制指定大小
  useEffect(() => {
    if (size >= 0) {
      triggerAnimation(size);
    }
  }, [size]);

  return (
    <g
      className={className}
      style={style}
      transform={`translate(${position.join()})`}
      {...rest}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onMouseDown={onMouseDown}
      fill={fill}
    >
      <circle
        cx='0'
        cy='0'
        r={actual}
        ref={circle}
        stroke='currentColor'
      >
        <animate
          ref={animate}
          fill='freeze'
          attributeName='r'
          dur={`${duration}ms`}
          calcMode='spline'
          keyTimes='0; 1'
          keySplines='0.2 1 1 1'
        />
      </circle>
      <rect
        x='-8'
        y='-8'
        height='16'
        width='16'
        className={Styles.focus}
      />
    </g>
  );
}
