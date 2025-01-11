import React from 'react';

import { MouseEvent } from 'react';
import { stringifyClass } from '@xiao-ai/utils';
import { useForceUpdate } from '@xiao-ai/utils/use';
import { Line as LineInstance, LinePath, MouseFocusClassName } from '@circuit/electronics';
import { styles as lineStyles } from './styles';
import { getLineRect, stringifyLinePath } from './utils';

export interface LineProps {
  /** 导线实体 */
  instance: LineInstance;
  /** 元件是否被选中 */
  selected?: boolean;
  /** 鼠标进入 */
  onMouseEnter?(id: string): void;
  /** 鼠标离开 */
  onMouseLeave?(id: string): void;
  /** 创建导线前 */
  onBeforeCreate?(id: string): void;
  /** 创建导线后 */
  onCreated?(id: string): void;
  /** 删除导线后 */
  onDeleted?(id: string): void;
  /** 点击器件 */
  onMouseDown?(ev: MouseEvent): void;
  /** 点击引脚 */
  onPointMouseDown?(ev: MouseEvent, index: number): void;
}

export function Line(props: LineProps) {
  const forceUpdate = useForceUpdate();
  const {
    instance,
    selected,
    onMouseEnter,
    onMouseLeave,
    onDeleted,
    onMouseDown,
    onPointMouseDown,
  } = props;
  const {
    id,
    path,
    points,
    connections,
  } = instance;

  return (
    <g
      className={stringifyClass(lineStyles.line, {
        [lineStyles.lineSelected]: selected,
      })}
    >
      <path d={stringifyLinePath(path)} />
      <g
        className={lineStyles.lineFocus}
        onMouseEnter={() => onMouseEnter?.(id)}
        onMouseLeave={() => onMouseLeave?.(id)}
      >
        {getLineRect(path).map((rect, i) => (
          <rect key={i} className={MouseFocusClassName} {...rect} />
        ))}
        {/* {points.map((point) => (
          <ElectronicPoint
            key={point.index}
            size={point.size}
            kind={PointKind.Line}
            position={point.position}
            status={point.status}
          />
        ))} */}
      </g>
    </g>
  );
}
