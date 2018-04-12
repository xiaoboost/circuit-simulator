import Vue from 'vue';
import Electronics from './parts';
import { Point } from 'src/lib/point';
import { Matrix } from 'src/lib/matrix';

/** 器件数据接口 */
export interface PartData {
    readonly id: string;
    readonly type: keyof Electronics;
    readonly hash: string;
    readonly rotate: Matrix;
    readonly position: Point;
    readonly params: string[];
    readonly connect: string[];
}

/** 器件引脚 */
export interface PartPoint {
    position: Point;
    direction: Point;
    class: string;
}

/** 组件对外接口 */
export interface ComponentInterface extends PartData, Vue {
    focus: boolean;
    points: PartPoint[];
    margin: PartMargin;
    pointSize: number[];

    renderText(): void;
    markSign(): void;
    deleteSign(): void;
    isCover(position?: Point): boolean;
}

/** 器件内外边距 */
export interface PartMargin {
    inner: number[][];
    outter: number[][];
}

/** 器件每项参数的说明 */
export interface ParmasDescription {
    /**
     * 该参数的文字描述
     * @type {string}
     */
    readonly label: string;
    /**
     * 该参数的物理单位
     * @type {string}
     */
    readonly unit: string;
    /**
     * 该参数是否对外显示
     * @type {boolean}
     */
    readonly vision: boolean;
    /**
     * 该参数的初始默认值
     * @type {string}
     */
    readonly default: string;
}

/** 器件每个节点的描述 */
export interface PointDescription {
    /**
     * 该节点距离器件中心点的相对位置
     * @type {[number, number]}
     */
    readonly position: [number, number];
    /**
     * 该节点对外延伸的方向
     * @type {[number, number]}
     */
    readonly direction: [number, number];
}

/** 外形元素描述 */
export interface ShapeDescription {
    /**
     * DOM 元素名称
     * @type {string}
     */
    readonly name: string;
    /**
     * DOM 元素的所有属性
     * @type {{ [x: string]: string }}
     */
    readonly attribute: { [x: string]: string };
    /**
     * 某些元素可能不可旋转
     * @type {true}
     */
    readonly 'non-rotate'?: true;
}

/** 器件原型数据类型 */
export interface ElectronicPrototype {
    /**
     * 器件编号的前置标记
     * @type {string}
     */
    readonly pre: string;
    /**
     * 器件种类
     * @type {string}
     */
    readonly type: string;
    /**
     * 器件简述
     * @type {string}
     */
    readonly introduction: string;
    /**
     * 周围文字距离器件中心点的偏移量
     * @type {number}
     */
    readonly txtLBias: number;
    /**
     * 器件内边框范围
     *  - 顺序是上、右、下、左
     * @type {[number, number, number, number]}
     */
    readonly padding: [number, number, number, number];
    /**
     * 器件外边框范围
     *  - 顺序是上、右、下、左
     * @type {[number, number, number, number]}
     */
    readonly margin: [number, number, number, number];
    /**
     * 每项参数的描述
     * @type {ParmasText[]}
     */
    readonly params: ParmasDescription[];
    /**
     * 器件每个节点的描述
     * @type {PointDescription[]}
     */
    readonly points: PointDescription[];
    /**
     * 器件外形元素的描述
     * @type {AspectDescription[]}
     */
    readonly shape: ShapeDescription[];
}
