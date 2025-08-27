import { createServiceKey, IRendererData } from '@circuit/inject';
import { ReactNode } from 'react';

/**
 * 左侧边栏渲染器
 */
export const LEFT_SIDEBAR_RENDER = createServiceKey<ILeftSidebarRender>('LeftSidebarRender');

/** 导线渲染器 */
export interface ILeftSidebarRender extends IRendererData<object> {
  /** 边栏标题 */
  title: ReactNode;
  /** 边栏图标 */
  icon: ReactNode;
}
