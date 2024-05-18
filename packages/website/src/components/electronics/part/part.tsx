import React from 'react';

import { MouseEvent, useState, useRef } from 'react';
import { stringifyClass } from '@xiao-ai/utils';
import { useForceUpdate } from '@xiao-ai/utils/use';
import { Part as PartInstance } from '@circuit/electronics';
import { editPartParams } from './editor';
import { PartText } from './text';
import { usePartCreated } from './use';
import { styles as partStyles } from './styles';
import { ElectronicPointKind, ElectronicPoint } from '../point';

export interface PartProps {
  /** 器件实体 */
  instance: PartInstance;
  /** 元件是否被选中 */
  selected?: boolean;
  /** 元件样式 */
  className?: string;
  /** 创建器件前 */
  onBeforeCreate?(id: string): void;
  /** 创建器件后 */
  onCreated?(id: string): void;
  /** 删除器件 */
  onDeleted?(id: string): void;
  /** 点击器件 */
  onMouseDown?(ev: MouseEvent): void;
  /** 点击引脚 */
  onPinMouseDown?(ev: MouseEvent, index: number): void;
  /** 点击文本 */
  onTextMouseDown?(ev: MouseEvent): void;
}

export function Part(props: PartProps) {
  const forceUpdate = useForceUpdate();
  const [editorShow, setEditorShow] = useState(false);
  const {
    instance,
    selected,
    onMouseDown,
    onPinMouseDown,
    onTextMouseDown,
  } = props;
  const {
    rotate,
    position,
    prototype,
    points,
    connections,
  } = instance;

  usePartCreated(props, forceUpdate);

  const editParam = () => {
    editPartParams({ id: '测试', position: position }).then((data) => {
      console.log('返回结束');
    });
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
      <g className={partStyles.partFocus}>
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
            onMouseDown={(ev) => onPinMouseDown?.(ev, i)}
          />
        ))}
      </g>
      <PartText instance={instance} onMouseDown={onTextMouseDown} />
    </g>
  );
}
