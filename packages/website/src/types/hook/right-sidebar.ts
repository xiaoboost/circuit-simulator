import { createServiceKey, IRendererData } from '@circuit/inject';
import { FC } from 'react';

/**
 * 右侧边栏渲染器
 */
export const RIGHT_SIDEBAR_RENDER = createServiceKey<IRightSidebarRender>('RightSidebarRender');

/** 导线渲染器 */
export interface IRightSidebarRender extends IRendererData<object> {
  /** 边栏标题 */
  title: FC;
  /** 边栏内容 */
  content: FC;
}
