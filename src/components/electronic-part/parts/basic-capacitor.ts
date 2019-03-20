import { ElectronicPrototype, PartType, UnitType  } from './constant';
import { numberParser } from 'src/lib/number';
import { isNumber } from 'src/lib/utils';

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
            unit: UnitType.Farad,
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
    // 电容器动态更新的是它的电压值
    iterative: {
        markInMatrix({ F, S }, branch, mark) {
            F.set(branch, branch, 1);
            S.set(branch, 0, mark);
        },
        createIterator({ Factor }, params, mark) {
            // 电容值
            const valueCap = numberParser(params[0]);
            // 积分的中间变量
            const save = {
                last: 0,
                integral: 0,
            };
            // 记录位置
            const position: [number, number][] = [];
            Factor.forEach((num, location) => {
                if (num === mark) {
                    position.push(location);
                }
            });

            // 从 factor 矩阵中找到对应的更新值的位置

            return ({ Current, interval }) => {
                // TODO: 从电流列向量中取得当前所需要的电流值
                const last = 0;

                // 积分，一阶近似累加
                const now = (last + save.last) / 2 * interval + save.integral;
                const voltage = now / valueCap;

                save.last = last;
                save.integral = now;

                // 更新系数矩阵
                position.forEach(([i, j]) => Factor.set(i, j, voltage));
            };
        },
    },
};

export default data;
