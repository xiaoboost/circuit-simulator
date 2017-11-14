/* tslint:disable:variable-name  */

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
export interface Electronic {
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

export const categories = [
    {
        key: 'virtual_device',
        name: '虚拟器件',
        parts: [
            'reference_ground',
            'voltage_meter',
            'current_meter',
        ],
    },
    {
        key: 'power',
        name: '电源',
        parts: [
            'dc_voltage_source',
            'ac_voltage_source',
            'dc_current_source',
        ],
    },
    {
        key: 'passive_device',
        name: '无源器件',
        parts: [
            'resistance',
            'capacitor',
            'inductance',
        ],
    },
    {
        key: 'semiconductor_device',
        name: '半导体器件',
        parts: [
            'diode',
            'transistor_npn',
            'operational_amplifier',
        ],
    },
];

/** 电阻 */
const resistance: Electronic = {
    pre: 'R',
    type: 'resistance',
    introduction: '电阻器',
    txtLBias: 14,
    padding: [0, 1, 0, 1],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '阻值',
            unit: 'Ω',
            default: '10k',
            vision: true,
        },
    ],
    points: [
        {
            position: [-40, 0],
            direction: [-1, 0],
        },
        {
            position: [40, 0],
            direction: [1, 0],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M-40,0H-24L-20,-9L-12,9L-4,-9L4,9L12,-9L20,9L24,0H40',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-30', y: '-13', width: '60', height: '26',
            },
        },
    ],
};

/** 电容 */
const capacitor: Electronic = {
    pre: 'C',
    type: 'capacitor',
    introduction: '电容器',
    txtLBias: 22,
    padding: [0, 1, 0, 1],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '电容量',
            unit: 'F',
            default: '100u',
            vision: true,
        },
    ],
    points: [
        {
            position: [-40, 0],
            direction: [-1, 0],
        },
        {
            position: [40, 0],
            direction: [1, 0],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M5,0H40M-40,0H-5M-5,-16V16M5,-16V16',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-30', y: '-15', width: '60', height: '30',
            },
        },
    ],
};

/** 电感 */
const inductance: Electronic = {
    pre: 'L',
    type: 'inductance',
    introduction: '电感器',
    txtLBias: 13,
    padding: [0, 1, 0, 1],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '电感量',
            unit: 'H',
            default: '10u',
            vision: true,
        },
    ],
    points: [
        {
            position: [-40, 0],
            direction: [-1, 0],
        },
        {
            position: [40, 0],
            direction: [1, 0],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M-40,0H-24M24,0H40M-24,0Q-18,-12,-12,0M-12,0Q-6,-12,0,0M0,0Q6,-12,12,0M12,0Q18,-12,24,0',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-30', y: '-10', width: '60', height: '15',
            },
        },
    ],
};

/** 直流电压源 */
const dc_voltage_source: Electronic = {
    pre: 'V',
    type: 'dc_voltage_source',
    introduction: '直流电压源',
    txtLBias: 24,
    padding: [1, 1, 1, 1],
    margin: [1, 0, 1, 0],
    params: [
        {
            label: '电压值',
            unit: 'V',
            default: '12',
            vision: true,
        },
    ],
    points: [
        {
            position: [0, -40],
            direction: [0, -1],
        },
        {
            position: [0, 40],
            direction: [0, 1],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M0,-40V-5M0,5V40M-16,-5H16M-10.5,5H10.5M-10,-12H-5M-7.5,-15V-9',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-16', y: '-30', width: '32', height: '60',
            },
        },
    ],
};

/** 交流电压源 */
const ac_voltage_source: Electronic = {
    pre: 'V',
    type: 'ac_voltage_source',
    introduction: '交流电压源',
    txtLBias: 24,
    padding: [1, 1, 1, 1],
    margin: [1, 0, 1, 0],
    params: [
        {
            label: '峰值电压',
            unit: 'V',
            default: '220',
            vision: true,
        },
        {
            label: '频率',
            unit: 'Hz',
            default: '50',
            vision: true,
        },
        {
            label: '偏置电压',
            unit: 'V',
            default: '0',
            vision: false,
        },
        {
            label: '初始相角',
            unit: '°',
            default: '0',
            vision: false,
        },
    ],
    points: [
        {
            position: [0, -40],
            direction: [0, -1],
        },
        {
            position: [0, 40],
            direction: [0, 1],
        },
    ],
    shape: [
        {
            name: 'circle',
            attribute: {
                cx: '0', cy: '0', r: '19', class: 'fill-white',
            },
        },
        {
            name: 'path',
            attribute: {
                d: 'M0,-40V-19.5M0,19.5V40M0,-16V-8M-4,-12H4M-4,15H4M-10,0Q-5,-10,0,0M0,0Q5,10,10,0',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-20', y: '-30', width: '40', height: '60',
            },
        },
    ],
};

/** 直流电流源 */
const dc_current_source: Electronic = {
    pre: 'I',
    type: 'dc_current_source',
    introduction: '直流电流源',
    txtLBias: 24,
    padding: [1, 0, 1, 0],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '电流值',
            unit: 'A',
            default: '10',
            vision: true,
        },
    ],
    points: [
        {
            position: [0, 40],
            direction: [0, 1],
        },
        {
            position: [0, -40],
            direction: [0, -1],
        },
    ],
    shape: [
        {
            name: 'circle',
            attribute: {
                cx: '0', cy: '0', r: '19', class: 'fill-white',
            },
        },
        {
            name: 'path',
            attribute: {
                d: 'M0,-40V-20M0,20V40M0,-12V12',
            },
        },
        {
            name: 'polygon',
            attribute: {
                points: '0,-14 -5,-4 0,-8 5,-4', class: 'fill-black', // fill: '#3B4449', 'stroke-width': '0.5', 'stroke-linecap': 'square'
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-20', y: '-30', width: '40', height: '60',
            },
        },
    ],
};

/** 参考地 */
const reference_ground: Electronic = {
    pre: 'GND',
    type: 'reference_ground',
    introduction: '参考地',
    txtLBias: 12,
    padding: [0, 0, 0, 0],
    margin: [1, 1, 1, 1],
    params: [],
    points: [
        {
            position: [0, -20],
            direction: [0, -1],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M0,-20V0M-12,0H12M-7,5H7M-2,10H2',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-15', y: '-10', width: '30', height: '26',
            },
        },
    ],
};

/** 电压表 */
const voltage_meter: Electronic = {
    pre: 'VM',
    type: 'voltage_meter',
    introduction: '电压表',
    txtLBias: 24,
    padding: [1, 1, 1, 1],
    margin: [1, 0, 1, 0],
    params: [],
    points: [
        {
            position: [0, -40],
            direction: [0, -1],
        },
        {
            position: [0, 40],
            direction: [0, 1],
        },
    ],
    shape: [
        {
            name: 'circle',
            attribute: {
                cx: '0', cy: '0', r: '19', class: 'fill-white',
            },
        },
        {
            name: 'path',
            attribute: {
                d: 'M0,-40V-20M0,20V40M0,-16V-8M-4,-12H4M-4,12H4',
            },
        },
        {
            'name': 'path',
            'non-rotate': true,
            'attribute': {
                d: 'M-7,-6L0,7L7,-6',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-20', y: '-30', width: '40', height: '60',
            },
        },
    ],
};

/** 电流表 */
const current_meter: Electronic = {
    pre: 'IM',
    type: 'current_meter',
    introduction: '电流表',
    txtLBias: 11,
    padding: [0, 0, 0, 0],
    margin: [1, 1, 1, 1],
    params: [],
    points: [
        {
            position: [-20, 0],
            direction: [-1, 0],
        },
        {
            position: [20, 0],
            direction: [1, 0],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M-20,0H20',
            },
        },
        {
            name: 'polygon',
            attribute: {
                points: '12,0 2,-6 6,0 2,6', class: 'fill-black',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-10', y: '-8', width: '20', height: '16',
            },
        },
    ],
};

/** 二极管 */
const diode: Electronic = {
    pre: 'VD',
    type: 'diode',
    introduction: '二极管',
    txtLBias: 18,
    padding: [1, 0, 1, 0],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '导通电压',
            unit: 'V',
            default: '1',
            vision: false,
        },
        {
            label: '导通电阻',
            unit: 'Ω',
            default: '0.5',
            vision: false,
        },
        {
            label: '关断电阻',
            unit: 'Ω',
            default: '5M',
            vision: false,
        },
    ],
    points: [
        {
            position: [0, -40],
            direction: [0, -1],
        },
        {
            position: [0, 40],
            direction: [0, 1],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M0,-40V40M-13,-11H13',
            },
        },
        {
            name: 'polygon',
            attribute: {
                points: '0,-11 -13,11 13,11', class: 'fill-black', // fill: '#3B4449', 'stroke-width': '1'
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-13', y: '-30', width: '26', height: '60',
            },
        },
    ],
};

/** NPN型三极管 */
const transistor_npn: Electronic = {
    pre: 'Q',
    type: 'transistor_npn',
    introduction: 'NPN型三极管',
    txtLBias: 25,
    padding: [1, 0, 1, 0],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '电流放大倍数',
            unit: '',
            default: '40',
            vision: false,
        },
        {
            label: 'B极电阻',
            unit: 'Ω',
            default: '26',
            vision: false,
        },
        {
            label: 'BE饱和压降',
            unit: 'V',
            default: '0.6',
            vision: false,
        },
        {
            label: 'CE饱和压降',
            unit: 'V',
            default: '1',
            vision: false,
        },
    ],
    points: [
        {
            position: [-20, 0],
            direction: [-1, 0],
        },
        {
            position: [20, -40],
            direction: [0, -1],
        },
        {
            position: [20, 40],
            direction: [0, 1],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M-20,0H0M0,-25V25M20,-40V-28L0,-12M0,12L20,28V40',
            },
        },
        {
            name: 'polygon',
            attribute: {
                class: 'fill-black',
                points: '0,0 -11,-6 -7,0 -11,6',
                transform: 'translate(18, 26.4) rotate(38.7)',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-10', y: '-30', width: '30', height: '60',
            },
        },
    ],
};

/** 运算放大器 */
const operational_amplifier: Electronic = {
    pre: 'OP',
    type: 'operational_amplifier',
    introduction: '运算放大器',
    // TODO: 文字需要位于器件中心
    txtLBias: 0,
    padding: [1, 0, 1, 0],
    margin: [1, 1, 1, 1],
    params: [
        {
            label: '开环增益',
            unit: 'dB',
            default: '120',
            vision: false,
        },
        {
            label: '输入电阻',
            unit: 'Ω',
            default: '80M',
            vision: false,
        },
        {
            label: '输出电阻',
            unit: 'Ω',
            default: '60',
            vision: false,
        },
        // {
        //     label: '截至频率',
        //     unit: 'Hz',
        //     default: '1M',
        //     vision: false,
        // },
    ],
    points: [
        {
            position: [-40, -20],
            direction: [-1, 0],
        },
        {
            position: [-40, 20],
            direction: [-1, 0],
        },
        {
            position: [40, 0],
            direction: [1, 0],
        },
    ],
    shape: [
        {
            name: 'path',
            attribute: {
                d: 'M-25,-35V35L25,0Z', class: 'fill-white',
            },
        },
        {
            name: 'path',
            attribute: {
                d: 'M-40,-20H-25M-40,20H-25M25,0H40',
            },
        },
        {
            name: 'path',
            attribute: {
                'd': 'M-22,-20H-16M-22,20H-16M-19,17V23', 'stroke-width': '1',
            },
        },
        {
            name: 'rect',
            attribute: {
                x: '-30', y: '-35', width: '60', height: '70',
            },
        },
    ],
};

const all: {
    resistance: Electronic;
    capacitor: Electronic;
    inductance: Electronic;
    dc_voltage_source: Electronic;
    ac_voltage_source: Electronic;
    dc_current_source: Electronic;
    reference_ground: Electronic;
    voltage_meter: Electronic;
    current_meter: Electronic;
    diode: Electronic;
    transistor_npn: Electronic;
    operational_amplifier: Electronic;

    [type: string]: Electronic;
} = {
    resistance,
    capacitor,
    inductance,
    dc_voltage_source,
    ac_voltage_source,
    dc_current_source,
    reference_ground,
    voltage_meter,
    current_meter,
    diode,
    transistor_npn,
    operational_amplifier,
};

export default all;
