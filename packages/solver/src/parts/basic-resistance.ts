import { PartSolverData } from './types';
import { isNumber } from '@xiao-ai/utils';
import { parseShortNumber } from '@circuit/math';
import { ElectronicKind } from '@circuit/electronics';

export const data: PartSolverData = {
  kind: ElectronicKind.Resistance,
  constant: ({ F, H }, params, branch) => {
    const param = params[0];
    const val = isNumber(param) ? param : parseShortNumber(param);

    F.set(branch, branch, -1);
    H.set(branch, branch, val);
  },
};
