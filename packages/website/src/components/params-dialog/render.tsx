import React from 'react';

import { Point } from '@circuit/math';
import { Modal } from './modal';
import { ParamForm, Params, FormData } from './form';

export interface Props {
  /** 器件编号 */
  id: string;
  /** 参数列表 */
  params: Params[];
  /** 指向的中心位置 */
  position: Point;
  /** 是否显示 */
  visible: boolean;
  /** 点击取消按钮 */
  onCancel?(): void;
  /** 点击确定按钮 */
  onConfirm?(data: FormData): void;
}

export function ParamsDialog(props: Props) {
  return <Modal visible={props.visible} position={props.position}>
    <ParamForm
      id={props.id}
      params={props.params}
      onCancel={() => props.onCancel?.()}
      onConfirm={(data) => props.onConfirm?.(data)}
    />
  </Modal>;
}
