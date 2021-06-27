import { IterativeCreation } from './types';
import { parseNumber } from '../utils/number';

/**
 * 压控压源
 *  - 虚拟器件，实际不存在
 *  - 含有两个参数
 *    - 放大系数
 *    - 控制输出电压的支路器件编号
 */
export const data: IterativeCreation = (part) => {
  return {
    constant({ F, H, getBranchById }) {
      const val = parseNumber(part.params[0]);
      const branch = getBranchById(part.id)!;
      const controlledBranch = getBranchById(part.params[1] as string)!;

      H.set(branch, branch, 0);
      F.set(branch, branch, 1);
      F.set(branch, controlledBranch, val);
    },
  };
};
