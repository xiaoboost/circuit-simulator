import { type IRendererData, createServiceKey } from '@circuit/inject';

/**
 * 主区域渲染器
 */
export const IMainAreaRender = createServiceKey<IMainAreaRender>('IMainAreaRender');

/** 主区域渲染器 */
// eslint-disable-next-line
export interface IMainAreaRender extends IRendererData<object> {
  // ..
}
