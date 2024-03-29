import { IterativeCreation } from './types';
import { getMark } from '../utils/mark';
import { parseNumber } from '../utils/number';

export const data: IterativeCreation = (part) => {
  const mark = getMark();
  const params = part.params.slice();

  return {
    constant({ F, S, getBranchById }) {
      const branch = getBranchById(part.id)!;
      F.set(branch, branch, 1);
      S.set(branch, 0, mark);
    },
    create({ Source, getCurrentMatrixByBranch }) {
      /** 电容值 */
      const valueCap = parseNumber(params[0]);
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
};
