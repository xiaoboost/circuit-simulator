import { PartSolverData } from './types';
import { ElectronicKind } from '@circuit/electronics';
import { getMark } from '../utils/mark';
import { parseNumber } from '../utils/number';

export const data: PartSolverData = {
  kind: ElectronicKind.AcVoltageSource,
  iterative: ({ id, params }) => {
    const mark = getMark();

    return {
      constant({ F, S, getBranchById }) {
        const branch = getBranchById(id)!;
        F.set(branch, branch, 1);
        S.set(branch, 0, mark);
      },
      create({ Source }) {
        /** 峰值电压 */
        const factor = parseNumber(params[0]);
        /** 频率 */
        const frequency = parseNumber(params[1]);
        /** 偏置电压 */
        const bias = parseNumber(params[2]);
        /** 初始相角 */
        const phase = parseNumber(params[3]);
        /** 需要更新的数值位置 */
        const position = Source.filterPosition(mark);

        const Pi2 = frequency * Math.PI * 2;
        const Degree = phase / 180 * Math.PI;

        return ({ time }) => {
          // 当前输出电压
          const volt = factor * Math.sin(time * Pi2 + Degree) + bias;
          // 更新矩阵的值
          position.forEach(([i, j]) => Source.set(i, j, volt));
        };
      },
    };
  },
};
