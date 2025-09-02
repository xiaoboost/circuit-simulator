import { createServiceKey, IRendererData } from '@circuit/inject';

/**
 * 属性输入渲染器
 */
export const PROPERTY_INPUT = createServiceKey<IPropertyInput>('PropertyInput');

/** 属性输入组件属性 */
export interface IPropertyInputProps<T = any, D extends object = object> {
  /** 属性描述 */
  property: D;
  /** 输入值 */
  value: T;
  /** 发生错误 */
  onError?: (error: string) => void;
  /** 输入值变化 */
  onChange: (value: T) => void;
}

/** 属性输入渲染器 */
export interface IPropertyInput<
  T = any,
  D extends object = object,
> extends IRendererData<IPropertyInputProps<T, D>> {
  /** 渲染器匹配 */
  match: (property: D) => boolean;
}
