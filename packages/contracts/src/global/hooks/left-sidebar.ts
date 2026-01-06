import { type IRendererData, createServiceKey } from '@circuit/inject';
import type { ReactNode } from 'react';

/**
 * 左侧边栏渲染器
 */
export const ILeftSidebarRender = createServiceKey<ILeftSidebarRender>('LeftSidebarRender');

/** 导线渲染器 */
export interface ILeftSidebarRender extends IRendererData<object> {
  /** 边栏标题 */
  title: ReactNode;
  /** 边栏图标 */
  icon: ReactNode;
}
