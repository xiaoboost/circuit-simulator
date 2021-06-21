import { PartSolverData } from './types';
import { ElectronicKind } from '@circuit/electronics';

export const data: PartSolverData = {
  kind: ElectronicKind.Capacitor,
  iterative: {
    markInMatrix({ F, S }, mark, branch) {
      F.set(branch, branch, 1);
      S.set(branch, 0, mark);
    },
    createIterator({ Source, getCurrentMatrixByBranch }, part: any, mark) {
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
