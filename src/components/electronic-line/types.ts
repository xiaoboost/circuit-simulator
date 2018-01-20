import { Point } from 'src/lib/point';

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
    options: {
        direction: Point;
    };
}
