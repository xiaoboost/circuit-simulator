import { PartTypes } from 'src/components/electronic-part';

/** 储存用的器件数据接口 */
export interface PartStorageData {
    type: PartTypes;
    id: string;
    position: number[];
    rotate?: number[][];
    text?: 'left' | 'top' | 'bottom' | 'right';
    params?: string[];
}

/** 储存用的器件数据接口 */
export interface LineStorageData {
    type: 'line';
    way: number[][];
}

/** 器件数据 */
export type ElectronicsData = Array<PartStorageData | LineStorageData>;

/** 当前时间配置项 */
export interface TimeConfig {
    endTime: string;
    stepSize: string;
    // TODO: 波形输出标志
}

export interface CircuitStorage {
    config?: TimeConfig;
    data: ElectronicsData;
}
