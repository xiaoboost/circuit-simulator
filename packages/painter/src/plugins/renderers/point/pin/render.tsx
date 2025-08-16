import { PropsWithHocParams } from '@circuit/inject';
import React, { useState, useRef, useEffect } from 'react';
import { useService } from '../../../../context';
import {
  IPinRendererProps,
  DRAG_SCENE_SERVICE,
  HOVER_SERVICE,
  PAINTER_CONFIGURATION_SERVICE,
  EntityKind,
} from '../../../../types';

function PinRenderer(props: IPinRendererProps) {
  const circle = useRef<SVGCircleElement>(null);
  const animate = useRef<SVGAnimationElement>(null);
  const dragService = useService(DRAG_SCENE_SERVICE);
  const hoverService = useService(HOVER_SERVICE);
  const configuration = useService(PAINTER_CONFIGURATION_SERVICE);
  const [actual, setActual] = useState(0);
  const {
    // 这只是为了满足类型，实际上不需要
    id: _,
    $$key: __,
    parentId,
    pinIndex,
    className,
    style,
    position,
    r: size = -1,
    hoverR = 5,
    normalR = 0,
    duration = 200,
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
    if (dragService.isDragging.data || configuration.movePainterMode.data) {
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

  useEffect(() => {
    const hoverUnOb = hoverService.status.observe((cur, pre) => {
      // 有拖动场景时，不进行任何操作
      if (dragService.isDragging.data) {
        return;
      }

      if (
        cur?.kind === EntityKind.PartPin ||
        cur?.kind === EntityKind.LinePin
      ) {
        if (cur.id === parentId && cur.pin === pinIndex) {
          handleHover(true);
        }
        return;
      }

      if (pre?.kind === EntityKind.PartPin || pre?.kind === EntityKind.LinePin) {
        if (pre.id === parentId && pre.pin === pinIndex) {
          handleHover(false);
        }
        return;
      }
    });
    const dragUnOb = dragService.isDragging.observe((val) => {
      if (val) {
        handleHover(false);
      }
    });

    return () => {
      hoverUnOb();
      dragUnOb();
    };
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
      fill={fill}
      {...rest}
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
          attributeType='XML'
          attributeName='r'
          begin='indefinite'
          dur={`${duration}ms`}
          calcMode='spline'
          keyTimes='0; 1'
          keySplines='0.2 1 1 1'
        />
      </circle>
    </g>
  );
}

export const Render = React.memo(PinRenderer);
