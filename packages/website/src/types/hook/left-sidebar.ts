import { createServiceKey, IRendererData } from '@circuit/inject';
import { FC } from 'react';

/**
 * 左侧边栏渲染器
 */
export const LEFT_SIDEBAR_RENDER = createServiceKey<ILeftSidebarRender>('LeftSidebarRender');

/** 导线渲染器 */
export interface ILeftSidebarRender extends IRendererData<object> {
  /** 边栏标题 */
  title: FC;
}
