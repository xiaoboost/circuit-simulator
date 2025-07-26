import { PIN_SIZE } from '@circuit/electronics';
import { PropsWithHocParams } from '@circuit/inject';
import React, { useState, useRef, useEffect } from 'react';
import { useService } from '../../../../context';
import {
  IPinRendererProps,
  DRAG_SCENE_SERVICE,
  PAINTER_CONFIGURATION_SERVICE,
} from '../../../../types';
import * as Styles from './styles.less';

function PinRenderer(props: IPinRendererProps) {
  const circle = useRef<SVGCircleElement>(null);
  const animate = useRef<SVGAnimationElement>(null);
  const dragService = useService(DRAG_SCENE_SERVICE);
  const configuration = useService(PAINTER_CONFIGURATION_SERVICE);
  const [actual, setActual] = useState(0);
  const {
    // 这只是为了满足类型，实际上不需要
    id: _,
    $$key: __,
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
  } = props as PropsWithHocParams<IPinRendererProps>;

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
    // 有场景正在运行或者是图纸移动模式时，不进行任何操作
    if (dragService.isDragging() || configuration.movePainterMode.data) {
      return;
    }

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
        height={PIN_SIZE}
        width={PIN_SIZE}
        className={Styles.focus}
      />
    </g>
  );
}

// function PinWithHOC(props: IPinRendererProps) {
//   const hocHooks = useHook(RENDERER_HOC, 'asc');
//   const { Component } = useMemo(
//     () => composeHOC({
//       name: 'PinRenderer',
//       order: 1,
//       getKey: ({ id }) => id,
//       Render: PinRenderer,
//     }, hocHooks),
//     [hocHooks],
//   );

//   return <Component $$key={props.id} {...props} />;
// }

export const Render = React.memo(PinRenderer);
