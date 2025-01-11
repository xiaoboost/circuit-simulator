import React from 'react';

import { MouseEvent } from 'react';
import { useRef, useEffect } from 'react';
import { MouseButtons } from '@xiao-ai/utils/web';
import { Point, Direction } from '@circuit/math';
import { DrawEventController } from '@circuit/event';
import { useForceUpdate } from '@xiao-ai/utils/use';
import { cursorStyles } from 'src/styles';
import { Part as PartInstance, ElectronicKind } from '@circuit/electronics';
import { styles as partStyles } from './styles';
import { textHeight, textSpaceHeight } from './constant';

export interface PartTextProps {
  /** 器件实例 */
  instance: PartInstance;
  /** 点击文本 */
  onMouseDown?(ev: MouseEvent): void;
}

const DirectionStyle: Partial<Record<Direction, React.CSSProperties>> = {
  [Direction.Top]: {
    textAnchor: 'middle',
  },
  [Direction.Bottom]: {
    textAnchor: 'middle',
  },
  [Direction.Left]: {
    textAnchor: 'end',
  },
  [Direction.Right]: {
    textAnchor: 'start',
  },
  [Direction.Center]: {
    textAnchor: 'middle',
  },
};

export function PartText({ instance, onMouseDown }: PartTextProps) {
  const forceUpdate = useForceUpdate();
  const textPosition = useRef(Point.from([0, 0]));
  const textDirection = useRef(Direction.Bottom);
  const {
    id,
    prototype,
    rotate,
    invRotate,
    texts,
    kind,
  } = instance;

  const setTextUIData = () => {
    const position = prototype.textPosition
    .map((item) => Point.from(item).rotate(rotate))
    .reduce(
      (pre, next) =>
        pre.distance(textPosition.current) < next.distance(textPosition.current) ? pre : next,
    );
    const direction = position.toDirection();
    const len = texts.length + 1;
    const bias = Math.max(...position.abs());

    switch (direction) {
      case Direction.Top: {
        position[0] = 0;
        position[1] = -((textHeight + textSpaceHeight) * (len - 1) + bias);
        break;
      }
      case Direction.Bottom: {
        position[0] = 0;
        position[1] = textHeight + bias;
        break;
      }
      case Direction.Left: {
        position[0] = -bias;
        position[1] = textHeight - (len * textHeight + (len - 1) * textSpaceHeight) / 2;
        break;
      }
      case Direction.Right: {
        position[0] = bias;
        position[1] = textHeight - (len * textHeight + (len - 1) * textSpaceHeight) / 2;
        break;
      }
      case Direction.Center: {
        position[0] = 0;
        position[1] = textHeight / 2;
        break;
      }
      default: {
        throw new Error(`错误的器件方向: ${Direction[direction]}`);
      }
    }

    textPosition.current = position.add([0, -2]);
    textDirection.current = direction;
  };

  const onTextMouseDown = (ev: React.MouseEvent) => {
    if (ev.button !== MouseButtons.Left) {
      return;
    }

    ev.stopPropagation();
    onMouseDown?.(ev);

    DrawEventController.create()
      .setClassName(cursorStyles.movePart)
      .setStopEvent({ type: 'mouseup', which: 'Left' })
      .setMoveEvent(({ movement }) => {
        textPosition.current = textPosition.current.add(movement);
        forceUpdate();
      })
      .start()
      .then(() => {
        setTextUIData();
        forceUpdate();
      });
  };

  useEffect(() => {
    setTextUIData();
  }, []);

  if (kind === ElectronicKind.ReferenceGround) {
    return;
  }

  const [label, subId] = id.split('_');

  return (
    <g
      fontSize={`${textHeight}px`}
      style={DirectionStyle[textDirection.current]}
      className={partStyles.partText}
      transform={`matrix(${invRotate.join()},${textPosition.current.rotate(invRotate).join()})`}
      onMouseDown={onTextMouseDown}
    >
      <text>
        <tspan>{label}</tspan>
        <tspan fontSize="70%">{subId}</tspan>
      </text>
      {texts.map((text, i) => (
        <text key={i} dy={(textHeight + textSpaceHeight) * (i + 1)}>{text}</text>
      ))}
    </g>
  );
}
