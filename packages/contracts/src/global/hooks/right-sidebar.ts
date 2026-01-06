import { type IRendererData, createServiceKey } from '@circuit/inject';
import type { ReactNode } from 'react';

/**
 * 右侧边栏渲染器
 */
export const IRightSidebarRender = createServiceKey<IRightSidebarRender>('RightSidebarRender');

/** 导线渲染器 */
export interface IRightSidebarRender extends IRendererData<object> {
  /** 边栏标题 */
  title: ReactNode;
}
