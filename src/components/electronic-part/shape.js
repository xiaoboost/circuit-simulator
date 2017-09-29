/*
 * 器件基本属性及外形形态描述——
 *   id             ID编号前缀
 *   type           器件种类
 *   input          输入的值
 *   inputTxt       显示输入值的说明
 *   visionNum      器件参数面板显示参数的数量
 *   points         管脚方向以及相对器件中心的位置
 *   padding        器件内边距
 *   margin         器件外边距
 *   txtLocate      显示的txt文本相对中心的距离
 *   criteriaTrend  电流相对于管脚所连接节点的方向
 *
 */

const Electronics = {
    // 电阻
    resistance: {
        readWrite: {
            id: 'R_',
            params: ['10k'],
        },
        readOnly: {
            type: 'resistance',
            introduction: '电阻器',
            txtLocate: 14,
            padding: [0, 1],
            margin: 1,
            text: [
                {
                    label: '阻值',
                    unit: 'Ω',
                    hidden: false,
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
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M-40,0H-24L-20,-9L-12,9L-4,-9L4,9L12,-9L20,9L24,0H40',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-30', 'y': '-13', 'width': '60', 'height': '26',
                    },
                },
            ],
        },
    },
    // 电容
    capacitor: {
        readWrite: {
            id: 'C_',
            params: ['100u'],
        },
        readOnly: {
            type: 'capacitor',
            introduction: '电容器',
            padding: [0, 1],
            margin: 1,
            txtLocate: 22,
            text: [
                {
                    label: '电容量',
                    unit: 'F',
                    hidden: false,
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
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M5,0H40M-40,0H-5M-5,-16V16M5,-16V16',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-30', 'y': '-15', 'width': '60', 'height': '30',
                    },
                },
            ],
        },
    },
    // 电感
    inductance: {
        readWrite: {
            id: 'L_',
            params: ['10u'],
        },
        readOnly: {
            type: 'inductance',
            introduction: '电感器',
            padding: [0, 1],
            margin: 1,
            txtLocate: 13,
            text: [
                {
                    label: '电感量',
                    unit: 'H',
                    hidden: false,
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
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M-40,0H-24M24,0H40M-24,0Q-18,-12,-12,0M-12,0Q-6,-12,0,0M0,0Q6,-12,12,0M12,0Q18,-12,24,0',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-30', 'y': '-10', 'width': '60', 'height': '15',
                    },
                },
            ],
        },
    },
    // 直流电压源
    dc_voltage_source: {
        readWrite: {
            id: 'V_',
            params: ['12'],
        },
        readOnly: {
            type: 'dc_voltage_source',
            introduction: '直流电压源',
            padding: 1,
            margin: [1, 0],
            txtLocate: 20,
            text: [
                {
                    label: '电压值',
                    unit: 'V',
                    hidden: false,
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
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M0,-40V-5M0,5V40M-16,-5H16M-10.5,5H10.5M-10,-12H-5M-7.5,-15V-9',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-16', 'y': '-30', 'width': '32', 'height': '60',
                    },
                },
            ],
        },
    },
    // 交流电压源
    ac_voltage_source: {
        readWrite: {
            id: 'V_',
            params: ['220', '50', '0', '0'],
        },
        readOnly: {
            type: 'ac_voltage_source',
            introduction: '交流电压源',
            padding: 1,
            margin: [1, 0],
            txtLocate: 24,
            text: [
                {
                    label: '峰值电压',
                    unit: 'V',
                    hidden: false,
                },
                {
                    label: '频率',
                    unit: 'Hz',
                    hidden: false,
                },
                {
                    label: '偏置电压',
                    unit: 'V',
                    hidden: true,
                },
                {
                    label: '初始相角',
                    unit: '°',
                    hidden: true,
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
            aspect: [
                {
                    'name': 'circle',
                    'attribute': {
                        'cx': '0', 'cy': '0', 'r': '19', 'class': 'fill-white',
                    },
                },
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M0,-40V-19.5M0,19.5V40M0,-16V-8M-4,-12H4M-4,15H4M-10,0Q-5,-10,0,0M0,0Q5,10,10,0',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-20', 'y': '-30', 'width': '40', 'height': '60',
                    },
                },
            ],
        },
    },
    // 直流电流源
    dc_current_source: {
        readWrite: {
            id: 'I_',
            params: ['10'],
        },
        readOnly: {
            type: 'dc_current_source',
            introduction: '直流电流源',
            padding: [1, 0],
            margin: 1,
            txtLocate: 24,
            text: [
                {
                    label: '电流值',
                    unit: 'A',
                    hidden: false,
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
            aspect: [
                {
                    'name': 'circle',
                    'attribute': {
                        'cx': '0', 'cy': '0', 'r': '19', 'class': 'fill-white',
                    },
                },
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M0,-40V-20M0,20V40M0,-12V12',
                    },
                },
                {
                    'name': 'polygon',
                    'attribute': {
                        'points': '0,-14 -5,-4 0,-8 5,-4', 'class': 'fill-black', // 'fill': '#3B4449', 'stroke-width': '0.5', 'stroke-linecap': 'square'
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-20', 'y': '-30', 'width': '40', 'height': '60',
                    },
                },
            ],
        },
    },
    // 参考地
    reference_ground: {
        readWrite: {
            id: 'GND_',
        },
        readOnly: {
            type: 'reference_ground',
            introduction: '参考地',
            padding: 0,
            margin: 1,
            txtLocate: 12,
            text: [],
            points: [
                {
                    position: [0, -20],
                    direction: [0, -1],
                },
            ],
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M0,-20V0M-12,0H12M-7,5H7M-2,10H2',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-15', 'y': '-10', 'width': '30', 'height': '26',
                    },
                },
            ],
        },
    },
    // 电压表
    voltage_meter: {
        readWrite: {
            id: 'VM_',
        },
        readOnly: {
            type: 'voltage_meter',
            introduction: '电压表',
            padding: 1,
            margin: [1, 0],
            txtLocate: 24,
            text: [],
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
            aspect: [
                {
                    'name': 'circle',
                    'attribute': {
                        'cx': '0', 'cy': '0', 'r': '19', 'class': 'fill-white',
                    },
                },
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M0,-40V-20M0,20V40M0,-16V-8M-4,-12H4M-4,12H4',
                    },
                },
                {
                    'name': 'path',
                    'non-rotate': true,
                    'attribute': {
                        'd': 'M-7,-6L0,7L7,-6',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-20', 'y': '-30', 'width': '40', 'height': '60',
                    },
                },
            ],
        },
    },
    // 电流表
    current_meter: {
        readWrite: {
            id: 'IM_',
        },
        readOnly: {
            type: 'current_meter',
            introduction: '电流表',
            padding: 0,
            margin: 1,
            txtLocate: 11,
            text: [],
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
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M-20,0H20',
                    },
                },
                {
                    'name': 'polygon',
                    'attribute': {
                        'points': '12,0 2,-6 6,0 2,6', 'class': 'fill-black',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-10', 'y': '-8', 'width': '20', 'height': '16',
                    },
                },
            ],
        },
    },
    // 二极管
    diode: {
        readWrite: {
            id: 'VD_',
            params: ['1', '0.5', '5M'],
        },
        readOnly: {
            type: 'diode',
            introduction: '二极管',
            padding: [1, 0],
            margin: 1,
            txtLocate: 18,
            text: [
                {
                    label: '导通电压',
                    unit: 'V',
                    hidden: true,
                },
                {
                    label: '导通电阻',
                    unit: 'Ω',
                    hidden: true,
                },
                {
                    label: '关断电阻',
                    unit: 'Ω',
                    hidden: true,
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
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M0,-40V40M-13,-11H13',
                    },
                },
                {
                    'name': 'polygon',
                    'attribute': {
                        'points': '0,-11 -13,11 13,11', 'class': 'fill-black', // 'fill': '#3B4449', 'stroke-width': '1'
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-13', 'y': '-30', 'width': '26', 'height': '60',
                    },
                },
            ],
        },
    },
    // NPN三极管
    transistor_npn: {
        readWrite: {
            id: 'Q_',
            params: ['40', '26', '0.6', '1'],
        },
        readOnly: {
            type: 'transistor_npn',
            introduction: 'NPN型三极管',
            padding: [1, 1, 1, 0],
            margin: 1,
            txtLocate: 25,
            text: [
                {
                    label: '电流放大倍数',
                    unit: '',
                    hidden: true,
                },
                {
                    label: 'B极电阻',
                    unit: 'Ω',
                    hidden: true,
                },
                {
                    label: 'BE饱和压降',
                    unit: 'V',
                    hidden: true,
                },
                {
                    label: 'CE饱和压降',
                    unit: 'V',
                    hidden: true,
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
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M-20,0H0M0,-25V25M20,-40V-28L0,-12M0,12L20,28V40',
                    },
                },
                {
                    'name': 'polygon',
                    'attribute': {
                        'points': '0,0 -11,-6 -7,0 -11,6', 'class': 'fill-black',
                        'transform': 'translate(18, 26.4) rotate(38.7)',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-10', 'y': '-30', 'width': '30', 'height': '60',
                    },
                },
            ],
        },
    },
    // 运放
    operational_amplifier: {
        readWrite: {
            id: 'OP_',
            params: ['120', '80M', '60'],
        },
        readOnly: {
            type: 'operational_amplifier',
            introduction: '运算放大器',
            padding: 1,
            margin: 1,
            // TODO:需要确认此处的值
            txtLocate: 0,
            text: [
                // TODO:现在是理想运放，非理想运放需要加入带宽范围这个属性
                {
                    label: '开环增益',
                    unit: 'dB',
                    hidden: true,
                },
                {
                    label: '输入电阻',
                    unit: 'Ω',
                    hidden: true,
                },
                {
                    label: '输出电阻',
                    unit: 'Ω',
                    hidden: true,
                },
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
            aspect: [
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M-25,-35V35L25,0Z', 'class': 'fill-white',
                    },
                },
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M-40,-20H-25M-40,20H-25M25,0H40',
                    },
                },
                {
                    'name': 'path',
                    'attribute': {
                        'd': 'M-22,-20H-16M-22,20H-16M-19,17V23', 'stroke-width': '1',
                    },
                },
                {
                    'name': 'rect',
                    'attribute': {
                        'x': '-30', 'y': '-35', 'width': '60', 'height': '70',
                    },
                },
            ],
        },
    },
};

// 内外边距转换为标准格式
// 标准格式为两个点，左上和右下
function css2obj(css) {
    if (css.length === 4) {
        return ([[-css[3], -css[0]], [+css[1], +css[2]]]);
    } else if (css.length === 3) {
        return ([[-css[1], -css[0]], [+css[1], +css[2]]]);
    } else if (css.length === 2) {
        return ([[-css[1], -css[0]], [+css[1], +css[0]]]);
    } else {
        return ([[-css, -css], [+css, +css]]);
    }
}
// 部分格式转换
Object.keys(Electronics).forEach((key) => {
    const data = Electronics[key].readOnly;

    // 内外边距
    data.padding = css2obj(data.padding);
    data.margin = css2obj(data.margin);

    // 冻结只读属性
    Object.freeze(data);
});

export default Electronics;
