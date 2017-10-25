import { Point } from 'src/lib/point';
import { Matrix } from 'src/lib/matrix';

/** 导线数据接口 */
export default interface LineData {
    id: string;
    type: 'line';
    way: Point[];
    connect: string[];
}
