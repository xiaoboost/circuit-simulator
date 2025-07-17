import type { ElectronicKind } from '@circuit/types';

/** 选中元件变化 */
export const SelectedChange = Symbol('SelectedChange');
/** 选中元件变化参数 */
export type SelectedChangePayload = Set<string>;

/** 新建器件 */
export const NewPart   = Symbol('NewPart');
/** 新建器件参数 */
export type NewPartPayload = { kind: ElectronicKind };
