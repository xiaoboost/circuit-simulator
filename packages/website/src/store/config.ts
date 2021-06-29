import { Watcher } from '@xiao-ai/utils';

/** 结束时间 */
export const end = new Watcher('10m');
/** 步长时间 */
export const step = new Watcher('10μ');
/** 示波器参数 */
export const oscilloscopes = new Watcher<string[][]>([]);
