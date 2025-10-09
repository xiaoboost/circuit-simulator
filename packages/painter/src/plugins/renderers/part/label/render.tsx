import {
  Point,
  Direction,
  invertRotateMatrix,
  DirectionVectorSet,
  DirectionLabel,
  isMatrixEqual,
  rotateVector,
} from '@circuit/algorithm';
import { IStreamService } from '@circuit/shared';
import { isEqual } from '@xiao-ai/utils';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useService, useWatcher } from '../../../../context';
import {
  IPartRendererProps,
  IMapCoordinateService,
  IDragSceneService,
  IPainterConfigurationService,
  PartLabelVisibleKind as Kind,
  PainterStreamConstant as Constant,
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
    referenceTag,
  } = data;
  const invRotate = useMemo(() => invertRotateMatrix(rotate), [rotate]);
  const [scale] = useWatcher(useService(IMapCoordinateService).scale);
  const textRef = useRef<SVGTextElement>(null);
  const [position, setPosition] = useState(new Point(0, 0));
  const [texts, setTexts] = useState<string[]>([]);
  const stream = useService(IStreamService)
    .get<Constant.PartLabelChangedPayload>(Constant.PartLabelChanged);
  const dragService = useService(IDragSceneService);
  const configurationService = useService(IPainterConfigurationService);
  const [partLabelVisible] = useWatcher(configurationService.partLabelVisible);
  const [textAnchor, setTextAnchor] = useState<React.SVGProps<SVGGElement>['textAnchor']>('middle');
  const textLineCount = getTextLineCount(partLabelVisible, texts);

  // 触发移动器件文本
  const onMouseDown = useCallback((event: React.MouseEvent<SVGGElement>) => {
    if (dragService.isLeftMouseDownNoMovingNoScene(event.nativeEvent)) {
      dragService.trigger('move-part-label', { id, event: event.nativeEvent });
    }
  }, [dragService]);

  // 更新器件说明文本
  useEffect(() => {
    if (
      !properties
      || properties.length === 0
      || !prototype.textBias
      || partLabelVisible === Kind.OnlyId
      || partLabelVisible === Kind.NotVisible
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
    const baselineOffset = Math.abs(textBoxRect.y / scale);
    /** 纵轴居中对齐时的偏移量 */
    const yMiddleOffset = (
      (
        Math.abs(Math.abs(textBoxRect.y) - textBoxRect.height / 2)
        * (textLineCount === 1 ? 1 : -1)
      )
      / scale
    );
    /** 横轴居中对齐时的偏移量 */
    const xMiddleOffset = -textBoxRect.width / scale / 2;
    /** 器件视角下的文本方向 */
    const textDirectionByPart = rotateVector(
      DirectionVectorSet[textDirection],
      invRotate,
    ).toDirection();
    /** 当前方向的偏移量 */
    const textBias = prototype.textBias[Direction[textDirectionByPart] as DirectionLabel] ?? 0;

    if (textDirection === Direction.Left) {
      setTextAnchor('end');
    }
    else if (textDirection === Direction.Right) {
      setTextAnchor('start');
    }
    else {
      setTextAnchor('middle');
    }

    if (textDirection === Direction.Left) {
      newPosition[0] = -textBias;
      newPosition[1] = yMiddleOffset;
    }
    else if (textDirection === Direction.Right) {
      newPosition[0] = textBias;
      newPosition[1] = yMiddleOffset;
    }
    else if (textDirection === Direction.Center) {
      newPosition[0] = xMiddleOffset;
      newPosition[1] = yMiddleOffset;
    }
    else if (textDirection === Direction.Top) {
      newPosition[0] = 0;
      newPosition[1] = -(textHeight + textSpaceHeight) * (textLineCount - 1) - textBias;
    }
    else if (textDirection === Direction.Bottom) {
      newPosition[0] = 0;
      newPosition[1] = baselineOffset + textBias;
    }

    setPosition(newPosition);
    stream.emit({ id });
  }, [
    texts,
    rotate,
    textDirection,
    referenceTag,
    textRef.current,
    partLabelVisible,
    textLineCount,
  ]);

  if (
    // 不存在偏移量
    !prototype.textBias
    // 没有需要显示的文本
    || textLineCount === 0
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
          <tspan>{prototype.pre}</tspan>
          <tspan fontSize="70%">{referenceTag}</tspan>
        </text>
      )}
      {texts.map((text, i) => (
        <text
          key={i}
          dy={
            (textHeight + textSpaceHeight)
            * (i + 1 - (visibleId ? 0 : 1))
          }
        >
          {text}
        </text>
      ))}
    </g>
  );
}

export const Render = React.memo(
  PartLabelRender,
  ({ data: prev }, { data: next }) => (
    prev.kind === next.kind
    && prev.referenceTag === next.referenceTag
    && isMatrixEqual(prev.rotate, next.rotate)
    && prev.textDirection === next.textDirection
    && isEqual(prev.propertyValues, next.propertyValues)
  ),
);
