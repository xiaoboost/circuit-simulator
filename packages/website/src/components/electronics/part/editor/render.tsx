import React from 'react';

import { Point } from '@circuit/math';
import { PartParamEditorModal } from './modal';
import { PartParamEditorForm, Params, FormData } from './form';

export interface PartParamEditorProps {
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

export function PartParamEditor(props: PartParamEditorProps) {
  return <PartParamEditorModal visible={props.visible} position={props.position}>
    <PartParamEditorForm
      id={props.id}
      params={props.params}
      onCancel={() => props.onCancel?.()}
      onConfirm={(data) => props.onConfirm?.(data)}
    />
  </PartParamEditorModal>;
}
