import { Point } from 'src/lib/point';
import { LineWay, WayMap } from './line-way';
import ElectronPart from 'src/components/electronic-part';

import { Omit } from 'type-zoo';

/** 导线数据接口 */
export interface LineData {
    readonly id: string;
    readonly type: 'line';
    readonly hash: string;
    readonly way: Point[];
    readonly connect: string[];
}

/** 调试返回的数据格式 */
export interface DebugData {
    method: string;
    args: any[];
}

/** 导线搜索数据接口 */
export interface ExchangeData {
    start: Point;
    end: Point;
    status: string;
    direction: Point;
    endBias?: Point;
}

interface SearchTempData {
    /** 当前鼠标偏移量 */
    mouseBais: Point;
    /** 当前绘图数据缓存 */
    wayMap: WayMap;
    /** 鼠标覆盖器件状态 */
    onPart?: {
        status: 'over' | 'leave';
        part: ElectronPart;
        pointIndex: number;
    };
}

/** 单点搜索参数 */
export type DrawingOption =
    Omit<ExchangeData, 'status'> &
    { temp: SearchTempData };
