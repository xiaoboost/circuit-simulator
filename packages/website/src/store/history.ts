import { Watcher } from '@xiao-ai/utils';
import { ElectronicData } from './types';

/** 图纸历史数据 */
export const parts = new Watcher<ElectronicData[]>([]);
