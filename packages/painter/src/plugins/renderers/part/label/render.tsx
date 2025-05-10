import { Point, Direction, invertRotateMatrix } from '@circuit/algorithm';
import React, { useEffect, useState, useRef } from 'react';
import { usePainterService } from '../../../../context';
import { IPartRendererProps, MAP_COORDINATE_SERVICE } from '../../../../types';
import { keys } from '../../../../utils';
import { textHeight, textSpaceHeight } from './constant';
import * as Styles from './styles.css';
import { getDirectionByLabel } from './utils';

export function Render({ data, prototype }: IPartRendererProps) {
  const {
    id,
    params,
    rotate,
    textDirection,
  } = data;
  const [label, subfix] = id.split('_');
  const invRotate = invertRotateMatrix(rotate);
  const { value: map } = usePainterService(MAP_COORDINATE_SERVICE);
  const textRef = useRef<SVGTextElement>(null);
  const [position, setPosition] = useState(new Point(0, 0));
  const [texts, setTexts] = useState<string[]>([]);
  const [textAnchor, setTextAnchor] = useState<React.CSSProperties['textAnchor']>('middle');

  // 更新器件说明文本
  useEffect(() => {
    if (!params || !prototype.textBias) {
      return;
    }

    setTexts(params
      .map((v, i) => ({ ...prototype.params[i], value: v }))
      .filter((txt) => txt.visible)
      .map((txt) => `${txt.value}${txt.unit}`.replace(/u/g, 'μ')),
    );
  }, [params]);

  useEffect(() => {
    if (!prototype.textBias || !textRef.current) {
      return;
    }

    /** 新坐标 */
    const newPosition = new Point(0, 0);
    /** 文本盒子渲染状态 */
    const textBoxRect = textRef.current.getBBox();
    /** 轴线偏移量 */
    const baselineOffset = Math.abs(textBoxRect.y / map.data.scale);
    /** 纵轴居中对齐时的偏移量*/
    const yMiddleOffset = (
      (
        Math.abs(Math.abs(textBoxRect.y) - textBoxRect.height / 2) *
        (texts.length === 0 ? 1 : -1)
      ) /
      map.data.scale
    );
    /** 横轴居中对齐时的偏移量*/
    const xMiddleOffset = - textBoxRect.width / map.data.scale / 2;

    // 求此时距离可偏移方向最近的位置
    const direction = keys(prototype.textBias)
      .filter(Boolean)
      .map((key) => getDirectionByLabel(key).mul(prototype.textBias![key]!))
      .map((bias) => bias.rotate(rotate))
      .reduce(
        (pre, next) =>
          pre.distance(position) < next.distance(position) ? pre : next,
      );

    const directionLabel = direction.toDirection();

    if (directionLabel === Direction.Left) {
      setTextAnchor('end');
    }
    else if (directionLabel === Direction.Right) {
      setTextAnchor('start');
    }
    else {
      setTextAnchor('middle');
    }

    if (directionLabel === Direction.Left) {
      newPosition[0] = - textBoxRect.width - direction[0];
      newPosition[1] = yMiddleOffset;
    }
    else if (directionLabel === Direction.Right) {
      newPosition[0] = direction[0];
      newPosition[1] = yMiddleOffset;
    }
    else if (directionLabel === Direction.Center) {
      newPosition[0] = xMiddleOffset;
      newPosition[1] = yMiddleOffset;
    }
    else if (directionLabel === Direction.Top) {
      newPosition[0] = 0;
      newPosition[1] = - textBoxRect.height - direction[1];
    }
    else if (directionLabel === Direction.Bottom) {
      newPosition[0] = 0;
      newPosition[1] = baselineOffset + direction[1];
    }

    setPosition(newPosition);
  }, [textDirection, texts, id, rotate, textRef.current]);

  // 不存在偏移量，则表示不需要显示
  if (!prototype.textBias) {
    return null;
  }

  return (
    <g
      ref={textRef}
      className={Styles.text}
      textAnchor={textAnchor}
      transform={`matrix(${invRotate.join()},${position.rotate(invRotate).join()})`}
    >
      <text>
        <tspan>{label}</tspan>
        <tspan fontSize="70%">{subfix}</tspan>
      </text>
      {texts.map((text, i) => (
        <text key={i} dy={(textHeight + textSpaceHeight) * (i + 1)}>{text}</text>
      ))}
    </g>
  );
}
