import { PartSolverData } from './types';
import { ElectronicKind } from '@circuit/electronics';

export const data: PartSolverData = {
  kind: ElectronicKind.AcVoltageSource,
  iterative: {
    markInMatrix({ F, S }, mark, branch) {
      F.set(branch, branch, 1);
      S.set(branch, 0, mark);
    },
    createIterator({ Source }, data: any, mark) {
      // /** 峰值电压 */
      // const factor = numberParser(data.params[0]);
      // /** 频率 */
      // const frequency = numberParser(data.params[1]);
      // /** 偏置电压 */
      // const bias = numberParser(data.params[2]);
      // /** 初始相角 */
      // const phase = numberParser(data.params[3]);
      // /** 需要更新的数值位置 */
      // const position = Source.filterPosition(mark);

      // const Pi2 = frequency * Math.PI * 2;
      // const Degree = phase / 180 * Math.PI;

      return ({ time }) => {
        // // 当前输出电压
        // const volt = factor * Math.sin(time * Pi2 + Degree) + bias;
        // // 更新矩阵的值
        // position.forEach(([i, j]) => Source.set(i, j, volt));
      };
    },
  },
};
