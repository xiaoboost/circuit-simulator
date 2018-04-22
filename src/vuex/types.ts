import { LineCore } from 'src/components/electronic-line';
import { PartCore, PartTypes } from 'src/components/electronic-part';

/** 时间配置接口 */
export interface TimeConfig {
    end: string;
    step: string;
}
/** vuex 状态接口 */
export interface StateType {
    /**
     * 页面状态
     */
    page: string;
    /**
     * 全局时间设置
     */
    time: TimeConfig;
    /**
     * 全局器件堆栈
     */
    Parts: PartCore[];
    /**
     * 全局导线堆栈
     */
    Lines: LineCore[];
    /**
     * 历史数据
     */
    historyData: Array<Array<PartCore | LineCore>>;
}

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
/* tslint:disable-next-line:no-empty-interface  */
export interface SimulateConfig extends TimeConfig {
    // TODO: 波形输出标志
}

export interface CircuitStorage {
    config?: SimulateConfig;
    data: ElectronicsData;
}
