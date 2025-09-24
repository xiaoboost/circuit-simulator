import { createServiceKey, IRendererData } from '@circuit/inject';

/**
 * 状态栏渲染器
 */
export const IStatusBarRender = createServiceKey<IStatusBarRender>('StatusBarRender');

/** 顶栏渲染器 */
export interface IStatusBarRender extends IRendererData<object> {
  /** 底栏位置 */
  position: 'left' | 'right';
}
