import { createServiceKey, IRendererData } from '@circuit/inject';

/**
 * 顶栏渲染器
 */
export const HEADER_RENDER = createServiceKey<IHeaderRender>('HeaderRender');

/** 顶栏渲染器 */
export interface IHeaderRender extends IRendererData<object> {
  /** 顶栏位置 */
  position: 'left' | 'right';
}
