import { ElectronicPrototype, UnitType } from './constant';
import { PartData, ElectronicKind } from '../constant';
import { numberParser, Direction } from 'src/math';

export const data: ElectronicPrototype = {
  pre: 'C',
  kind: ElectronicKind.Capacitor,
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
      ranks: ['', 'm', 'μ', 'n', 'p'],
    },
  ],
  points: [
    {
      position: [-40, 0],
      direction: Direction.Left,
    },
    {
      position: [40, 0],
      direction: Direction.Right,
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
        x: '-30', y: '-15', width: '60', height: '30', className: 'focus-transparent',
      },
    },
  ],
  // 这里是把电容看作是随电流积分而变得电压源
  iterative: {
    markInMatrix({ F, S }, mark, branch) {
      F.set(branch, branch, 1);
      S.set(branch, 0, mark);
    },
    createIterator({ Source, getCurrentMatrixByBranch }, part: PartData, mark) {
      // /** 电容值 */
      // const valueCap = numberParser(part.params[0]);
      // /** 需要更新的数值位置 */
      // const position = Source.filterPosition(mark);
      // /** 当前器件的电流计算矩阵 */
      // const currentMatrix = getCurrentMatrixByBranch(part.id);
      // /** 积分的中间变量 */
      // const save = {
      //   last: 0,
      //   integral: 0,
      // };

      return ({ Current, interval }) => {
        // /** 当前电流 */
        // const current = currentMatrix.mul(Current).get(0, 0);

        // // 电流积分，一阶近似累加
        // const now = (current + save.last) / 2 * interval + save.integral;
        // const voltage = now / valueCap;

        // save.last = current;
        // save.integral = now;

        // // 更新系数矩阵
        // position.forEach(([i, j]) => Source.set(i, j, voltage));
      };
    },
  },
};
