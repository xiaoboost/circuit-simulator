import { PartTypes } from 'src/components/electronic-part/types';

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

export type CircuitStorageData = Array<PartStorageData | LineStorageData>;
