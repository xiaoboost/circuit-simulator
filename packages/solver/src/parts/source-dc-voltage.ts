import { PartSolverData } from './types';
import { isNumber } from '@xiao-ai/utils';
import { parseShortNumber } from '@circuit/math';
import { ElectronicKind } from '@circuit/electronics';

export const data: PartSolverData = {
  kind: ElectronicKind.DcVoltageSource,
  constant({ F, S }, params, branch) {
    const param = params[0];
    const val = isNumber(param) ? param : parseShortNumber(param);

    F.set(branch, branch, 1);
    S.set(branch, 0, val);
  },
};
