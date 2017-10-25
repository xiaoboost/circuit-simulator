import { Point } from 'src/lib/point';
import { Matrix } from 'src/lib/matrix';

/** 器件数据接口 */
export interface PartData {
    id: string;
    type: string;
    rotate: Matrix;
    position: Point;
    params: string[];
    connect: string[];
}
