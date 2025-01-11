import React from 'react';

import { MouseEvent } from 'react';
import { stringifyClass } from '@xiao-ai/utils';
import { useForceUpdate } from '@xiao-ai/utils/use';
import { Part as PartInstance } from '@circuit/electronics';
import { editPartParams } from './editor';
import { PartText } from './text';
import { usePartCreate } from './use';
import { styles as partStyles } from './styles';
import { ElectronicPointKind, ElectronicPoint } from '../point';

export interface PartProps {
  /** 器件实体 */
  instance: PartInstance;
  /** 元件是否被选中 */
  selected?: boolean;
  /** 鼠标进入 */
  onMouseEnter?(id: string): void;
  /** 鼠标离开 */
  onMouseLeave?(id: string): void;
  /** 创建器件前 */
  onBeforeCreate?(id: string): void;
  /** 创建器件后 */
  onCreated?(id: string): void;
  /** 删除器件后 */
  onDeleted?(id: string): void;
  /** 点击器件 */
  onMouseDown?(ev: MouseEvent): void;
  /** 点击引脚 */
  onPinMouseDown?(ev: MouseEvent, part: PartInstance, index: number): void;
  /** 点击文本 */
  onTextMouseDown?(ev: MouseEvent): void;
}

export function Part(props: PartProps) {
  const forceUpdate = useForceUpdate();
  const {
    instance,
    selected,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onPinMouseDown,
    onTextMouseDown,
  } = props;
  const {
    id,
    params,
    rotate,
    position,
    prototype,
    points,
    connections,
  } = instance;

  usePartCreate(props, forceUpdate);

  const editParam = async () => {
    const result = await editPartParams({
      id,
      params,
      prototype,
      position,
    });

    instance.changeId(result.id);
    instance.params = result.params;
  };

  return (
    <g
      className={stringifyClass(partStyles.part, {
        [partStyles.partSelected]: selected,
      })}
      onDoubleClick={editParam}
      onMouseDown={onMouseDown}
      transform={`matrix(${rotate.join()},${position.join()})`}
    >
      <g
        className={partStyles.partFocus}
        onMouseEnter={() => onMouseEnter?.(id)}
        onMouseLeave={() => onMouseLeave?.(id)}
      >
        {prototype.shape.map((item, i) => (
          React.createElement(item.name, {
            ...item.attribute,
            key: i,
          })
        ))}
        {points.map((point, i) => (
          <ElectronicPoint
            key={point.index}
            size={point.ui.size}
            kind={connections[i].isSpace ? ElectronicPointKind.PartPin : ElectronicPointKind.PartPinLine}
            position={point.origin}
            onMouseDown={(ev) => onPinMouseDown?.(ev, instance, i)}
          />
        ))}
      </g>
      <PartText instance={instance} onMouseDown={onTextMouseDown} />
    </g>
  );
}
