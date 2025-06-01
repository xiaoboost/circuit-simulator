import {
  Point,
  Direction,
  invertRotateMatrix,
  DirectionVectorSet,
  DirectionLabel,
  isMatrixEqual,
  rotateVector,
} from '@circuit/algorithm';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePainterService, useWatcher } from '../../../../context';
import {
  PartLabelVisibleKind as Kind,
  IPartRendererProps,
  MAP_COORDINATE_SERVICE,
  DRAG_SCENE_SERVICE,
  EVENT_BUS_SERVICE,
  CONFIGURATION_SERVICE,
} from '../../../../types';
import { textHeight, textSpaceHeight } from './constant';
import * as Styles from './styles.less';

function getTextLineCount(partLabelVisible: Kind, texts: string[]) {
  if (partLabelVisible === Kind.NotVisible) {
    return 0;
  }

  if (partLabelVisible === Kind.OnlyParam) {
    return texts.length;
  }

  if (partLabelVisible === Kind.OnlyId) {
    return 1;
  }

  return 1 + texts.length;
}

function PartLabelRender({ data, prototype }: IPartRendererProps) {
  const {
    id,
    params,
    rotate,
    textDirection,
  } = data;
  const [label, subfix] = id.split('_');
  const invRotate = invertRotateMatrix(rotate);
  const { value: { data: map } } = usePainterService(MAP_COORDINATE_SERVICE);
  const textRef = useRef<SVGTextElement>(null);
  const [position, setPosition] = useState(new Point(0, 0));
  const [texts, setTexts] = useState<string[]>([]);
  const eventBus = usePainterService(EVENT_BUS_SERVICE);
  const dragService = usePainterService(DRAG_SCENE_SERVICE);
  const [partLabelVisible] = useWatcher(usePainterService(CONFIGURATION_SERVICE).partLabelVisible);
  const [textAnchor, setTextAnchor] = useState<React.CSSProperties['textAnchor']>('middle');
  const textLineCount = getTextLineCount(partLabelVisible, texts);

  // 触发移动器件文本
  const onMouseDown = useCallback((event: React.MouseEvent<SVGGElement>) => {
    // 非左键不处理
    if (event.button !== 0) {
      return;
    }

    // 事件互斥
    if (dragService.size !== 0) {
      return;
    }

    dragService.trigger('move-part-label', {
      id,
      event,
    });
  }, [dragService]);

  // 更新器件说明文本
  useEffect(() => {
    if (
      !params ||
      !prototype.textBias ||
      partLabelVisible === Kind.OnlyId ||
      partLabelVisible === Kind.NotVisible
    ) {
      setTexts([]);
      return;
    }

    setTexts((params as string[])
      .map((v, i) => ({ ...prototype.params[i], value: v }))
      .filter((txt) => txt.visible)
      .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ')),
    );
  }, [params, partLabelVisible]);

  useEffect(() => {
    if (!prototype.textBias || !textRef.current) {
      return;
    }

    /** 新坐标 */
    const newPosition = new Point(0, 0);
    /** 文本盒子渲染状态 */
    const textBoxRect = textRef.current.getBBox();
    /** 轴线偏移量 */
    const baselineOffset = Math.abs(textBoxRect.y / map.scale);
    /** 纵轴居中对齐时的偏移量*/
    const yMiddleOffset = (
      (
        Math.abs(Math.abs(textBoxRect.y) - textBoxRect.height / 2) *
        (textLineCount === 1 ? 1 : -1)
      ) /
      map.scale
    );
    /** 横轴居中对齐时的偏移量*/
    const xMiddleOffset = - textBoxRect.width / map.scale / 2;

    // 当前方向的偏移量
    const textBias = prototype.textBias[Direction[textDirection] as DirectionLabel] ?? 0;
    const finalDirection = rotateVector(DirectionVectorSet[textDirection], rotate).toDirection();

    if (finalDirection === Direction.Left) {
      setTextAnchor('end');
    }
    else if (finalDirection === Direction.Right) {
      setTextAnchor('start');
    }
    else {
      setTextAnchor('middle');
    }

    if (finalDirection === Direction.Left) {
      newPosition[0] = - textBias;
      newPosition[1] = yMiddleOffset;
    }
    else if (finalDirection === Direction.Right) {
      newPosition[0] = textBias;
      newPosition[1] = yMiddleOffset;
    }
    else if (finalDirection === Direction.Center) {
      newPosition[0] = xMiddleOffset;
      newPosition[1] = yMiddleOffset;
    }
    else if (finalDirection === Direction.Top) {
      newPosition[0] = 0;
      newPosition[1] = - (textHeight + textSpaceHeight) * texts.length - textBias;
    }
    else if (finalDirection === Direction.Bottom) {
      newPosition[0] = 0;
      newPosition[1] = baselineOffset + textBias;
    }

    setPosition(newPosition);
    eventBus.notify('PartLabelChanged');
  }, [textDirection, texts, id, rotate, textRef.current, partLabelVisible]);

  if (
    // 不存在偏移量
    !prototype.textBias ||
    // 没有需要显示的文本
    textLineCount === 0
  ) {
    return null;
  }

  const visibleId = partLabelVisible === Kind.OnlyId || partLabelVisible === Kind.Visible;

  return (
    <g
      ref={textRef}
      className={Styles.text}
      textAnchor={textAnchor}
      transform={`matrix(${invRotate.join()},${position.rotate(invRotate).join()})`}
      onMouseDown={onMouseDown}
    >
      {visibleId && (
        <text>
          <tspan>{label}</tspan>
          <tspan fontSize="70%">{subfix}</tspan>
        </text>
      )}
      {texts.map((text, i) => (
        <text
          key={i}
          dy={
            (textHeight + textSpaceHeight) *
            (i + 1 - (visibleId ? 0 : 1))
          }
        >{text}</text>
      ))}
    </g>
  );
}

export const Render = React.memo(
  PartLabelRender,
  ({ data: prev }, { data: next }) => (
    prev.id === next.id &&
    prev.kind === next.kind &&
    isMatrixEqual(prev.rotate, next.rotate) &&
    prev.textDirection === next.textDirection &&
    prev.params.every((text, i) => text === next.params[i])
  ),
);
