import { Point } from 'src/lib/point';
import ElectronPart from 'src/components/electronic-part';

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
    options: {
        map: string;
        status: string;
        direction: Point;
    };
}

interface SearchTempData {
    onPart: string | ElectronPart;
    map: '';
}

/** 单点搜索参数 */
export interface DrawingOption {
    start: Point;
    end: Point;
    map: string;
    direction: Point;
    temp: SearchTempData;
}
