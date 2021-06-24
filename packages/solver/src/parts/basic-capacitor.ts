import { PartSolverData } from './types';
import { parseShortNumber } from '@circuit/math';
import { ElectronicKind } from '@circuit/electronics';

export const data: PartSolverData = {
  kind: ElectronicKind.Capacitor,
  iterative: () => {
    const mark = 0;

    return {
      markMatrix({ F, S }, branch) {
        F.set(branch, branch, 1);
        S.set(branch, 0, mark);
      },
      create({ Source, getCurrentMatrixByBranch }, part: any) {
        /** 电容值 */
        const valueCap = parseShortNumber(part.params[0]);
        /** 需要更新的数值位置 */
        const position = Source.filterPosition(mark);
        /** 当前器件的电流计算矩阵 */
        const currentMatrix = getCurrentMatrixByBranch(part.id);
        /** 积分的中间变量 */
        const saveData = {
          last: 0,
          integral: 0,
        };

        return ({ Current, interval }) => {
          /** 当前电流 */
          const current = currentMatrix.mul(Current).get(0, 0);

          // 电流积分，一阶近似累加
          const now = (current + saveData.last) / 2 * interval + saveData.integral;
          const voltage = now / valueCap;

          saveData.last = current;
          saveData.integral = now;

          // 更新系数矩阵
          position.forEach(([i, j]) => Source.set(i, j, voltage));
        };
      },
    };
  },
};
