import { Point } from 'src/lib/point';
import { Matrix } from 'src/lib/matrix';

/** 器件数据接口 */
export interface PartData {
    readonly id: string;
    readonly type: string;
    readonly hash: string;
    readonly rotate: Matrix;
    readonly position: Point;
    readonly params: string[];
    readonly connect: string[];
}

/** 器件引脚描述接口 */
export interface PointClass {
    position: Point;
    direction: Point;
    class: string;
}

/** 器件内外边距 */
export interface PartMargin {
    inner: [[number, number], [number, number]];
    outter: [[number, number], [number, number]];
}
