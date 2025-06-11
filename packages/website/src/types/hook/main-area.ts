import { createServiceKey, IRendererData } from '@circuit/inject';

/**
 * 主区域渲染器
 */
export const MAIN_AREA_RENDER = createServiceKey<IMainAreaRender>('IMainAreaRender');

/** 导线渲染器 */
// eslint-disable-next-line
export interface IMainAreaRender extends IRendererData<object> {
  // ..
}
