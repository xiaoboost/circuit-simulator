/** 器件类型枚举常量 */
export const enum PartType {
    /** 电阻 */
    Resistance,
    /** 电感 */
    Inductance,
    /** 电容 */
    Capacitor,
    /** 电流测量 */
    CurrentMeter,
    /** 电压测量 */
    VoltageMeter,
    /** 运算放大器 */
    OperationalAmplifier,
    /** 二极管 */
    Diode,
    /** npn 三极管 */
    TransistorNPN,
    /** 交流电压源 */
    AcVoltageSource,
    /** 直流电流源 */
    DcCurrentSource,
    /** 直流电压源 */
    DcVoltageSource,
    /** 参考地 */
    ReferenceGround,
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
     * @type {PartType}
     */
    readonly type: PartType;
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
