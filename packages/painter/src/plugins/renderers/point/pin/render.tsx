import { PropsWithHocParams } from '@circuit/inject';
import React, { useState, useRef, useEffect } from 'react';
import { useService } from '../../../../context';
import {
  IPinRendererProps,
  IDragSceneService,
  IHoverService,
  IPainterConfigurationService,
  EntityKind,
  Entity,
} from '../../../../types';

function PinRenderer(props: IPinRendererProps) {
  const circle = useRef<SVGCircleElement>(null);
  const animate = useRef<SVGAnimationElement>(null);
  const dragService = useService(IDragSceneService);
  const hoverService = useService(IHoverService);
  const configuration = useService(IPainterConfigurationService);
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
    function isHover(entity: Entity | undefined) {
      return (
        (
          entity?.kind === EntityKind.PartPin
          || entity?.kind === EntityKind.LinePin
        )
        && (
          entity.id === parentId
          && entity.pin === pinIndex
        )
      );
    }

    function isEnableHover() {
      return (
        !dragService.isDragging.data
        && !configuration.movePainterMode.data
      );
    }

    function handleObHover(hoverFalse: boolean) {
      if (hoverFalse) {
        handleHover(false);
      }
      else if (isHover(hoverService.current.data)) {
        handleHover(true);
      }
    }

    const hoverUnOb = hoverService.current.observe((cur, pre) => {
      if (!isEnableHover()) {
        return;
      }

      if (isHover(cur)) {
        handleHover(true);
      }
      else if (isHover(pre)) {
        handleHover(false);
      }
    });
    const dragUnOb = dragService.isDragging.observe(handleObHover);
    const moveUnOb = configuration.movePainterMode.observe(handleObHover);

    return () => {
      hoverUnOb();
      dragUnOb();
      moveUnOb();
    };
  }, [
    hoverR,
    normalR,
    size,
  ]);

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
        cx="0"
        cy="0"
        r={actual}
        ref={circle}
        stroke="currentColor"
      >
        <animate
          ref={animate}
          fill="freeze"
          attributeType="XML"
          attributeName="r"
          begin="indefinite"
          dur={`${duration}ms`}
          calcMode="spline"
          keyTimes="0; 1"
          keySplines="0.2 1 1 1"
        />
      </circle>
    </g>
  );
}

export const Render = React.memo(PinRenderer);
