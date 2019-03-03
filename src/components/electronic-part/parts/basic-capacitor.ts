import { ElectronicPrototype, PartType, IterativeInputType } from './constant';
import { numberParser } from 'src/lib/native';

const data: ElectronicPrototype = {
    pre: 'C',
    type: PartType.Capacitor,
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
                x: '-30', y: '-15', width: '60', height: '30', class: 'focus-transparent',
            },
        },
    ],
    iterative({ part, timeInterval }) {
        // 电容值
        const valueCap = numberParser(part.params[0]);
        // 积分的中间变量
        const save = {
            last: 0,
            integral: 0,
        };

        return {
            output: [],
            input: [
                {
                    type: IterativeInputType.Current,
                    place: `${part.id}-0`,
                },
            ],
            process(current: number) {
                // 积分，一阶近似累加
                const now = (current + save.last) / 2 * timeInterval + save.integral;
                const voltage = now / valueCap;

                save.last = current;
                save.integral = now;

                return ([voltage]);
            },
        };
    },
};

export default data;
