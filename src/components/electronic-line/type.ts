import { Point } from 'src/lib/point';

/** 导线数据接口 */
export interface LineData {
    id: string;
    type: 'line';
    way: Point[];
    connect: string[];
}
