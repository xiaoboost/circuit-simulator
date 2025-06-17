import {
  Point,
  Direction,
  invertRotateMatrix,
  DirectionVectorSet,
  DirectionLabel,
  isMatrixEqual,
  rotateVector,
} from '@circuit/algorithm';
import {
  CONFIGURATION_SERVICE,
  EVENT_BUS_SERVICE,
  EventBusEvent,
  PartLabelVisibleKind as Kind,
} from '@circuit/shared';
import { isEqual } from '@xiao-ai/utils';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useService, useWatcher } from '../../../../context';
import {
  IPartRendererProps,
  MAP_COORDINATE_SERVICE,
  DRAG_SCENE_SERVICE,
} from '../../../../types';
import { textHeight, textSpaceHeight } from './constant';
import * as Styles from './styles.less';
import { getTextLineCount, propertyToString } from './utils';

function PartLabelRender({ data, prototype }: IPartRendererProps) {
  const {
    id,
    propertyValues: properties,
    rotate,
    textDirection,
  } = data;
  const [label, subfix] = id.split('_');
  const invRotate = invertRotateMatrix(rotate);
  const { value: { data: map } } = useService(MAP_COORDINATE_SERVICE);
  const textRef = useRef<SVGTextElement>(null);
  const [position, setPosition] = useState(new Point(0, 0));
  const [texts, setTexts] = useState<string[]>([]);
  const eventBus = useService(EVENT_BUS_SERVICE);
  const dragService = useService(DRAG_SCENE_SERVICE);
  const configurationService = useService(CONFIGURATION_SERVICE);
  const [partLabelVisible] = useWatcher(configurationService.partLabelVisible);
  const [textAnchor, setTextAnchor] = useState<React.CSSProperties['textAnchor']>('middle');
  const textLineCount = getTextLineCount(partLabelVisible, texts);

  // 触发移动器件文本
  const onMouseDown = useCallback((event: React.MouseEvent<SVGGElement>) => {
    // 非左键不处理
    if (event.button !== 0) {
      return;
    }

    // 移动图纸模式下不触发
    if (configurationService.movePainterMode.data) {
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
      !properties ||
      properties.length === 0 ||
      !prototype.textBias ||
      partLabelVisible === Kind.OnlyId ||
      partLabelVisible === Kind.NotVisible
    ) {
      setTexts([]);
      return;
    }

    setTexts((properties)
      .map((v, i) => ({
        visibleInPainter: prototype.properties[i].visibleInPainter,
        value: propertyToString(v, prototype.properties[i]),
      }))
      .filter((txt) => txt.visibleInPainter)
      .map(({ value }) => value),
    );
  }, [properties, partLabelVisible]);

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
      newPosition[1] = - (textHeight + textSpaceHeight) * (textLineCount - 1) - textBias;
    }
    else if (finalDirection === Direction.Bottom) {
      newPosition[0] = 0;
      newPosition[1] = baselineOffset + textBias;
    }

    setPosition(newPosition);
    eventBus.notify(EventBusEvent.PART_LABEL_CHANGED, id);
  }, [textDirection, texts, id, rotate, textRef.current, partLabelVisible, textLineCount]);

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
    isEqual(prev.propertyValues, next.propertyValues)
  ),
);
