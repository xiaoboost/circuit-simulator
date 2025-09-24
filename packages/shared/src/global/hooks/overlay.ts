import { createServiceKey, type IRendererData } from '@circuit/inject';

/**
 * 浮层渲染器
 */
export const IOverlayRender = createServiceKey<IOverlayRender>('IOverlayRender');

/** 浮层渲染器 */
// eslint-disable-next-line
export interface IOverlayRender extends IRendererData<object> {
  // ..
}
