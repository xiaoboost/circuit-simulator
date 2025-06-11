import { createServiceKey, IRendererData } from '@circuit/inject';

/**
 * 底栏渲染器
 */
export const FOOTER_RENDER = createServiceKey<IFooterRender>('FooterRender');

/** 顶栏渲染器 */
export interface IFooterRender extends IRendererData<object> {
  /** 底栏位置 */
  position: 'left' | 'right';
}
