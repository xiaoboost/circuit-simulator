import { Point } from 'src/lib/point';
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

/** 导线搜索数据接口 */
export interface ExchangeData {
    start: Point;
    end: Point;
    bias: Point;
    map: string;
    status: string;
    direction: Point;
}

interface SearchTempData {
    onPart: string | ElectronPart;
}

/** 单点搜索参数 */
export type DrawingOption =
    Omit<ExchangeData, 'bias' | 'status'> &
    { temp: SearchTempData };
