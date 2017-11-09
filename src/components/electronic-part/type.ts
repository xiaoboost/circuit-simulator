import Vue from 'vue';
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

/** 器件引脚描述接口 */
export interface PointClass {
    position: Point;
    direction: Point;
    class: 'part-point-close' | 'part-point-open';
}

/** 器件组件对外接口 */
export interface PartComponent extends Vue {
    /** 器件 ID 编号 */
    id: string;
}
