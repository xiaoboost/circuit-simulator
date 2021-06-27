import { PartSolverData } from './types';
import { ElectronicKind } from '@circuit/electronics';
import { parseNumber } from '../utils/number';

export const data: PartSolverData = {
  kind: ElectronicKind.DcVoltageSource,
  iterative: ({ id, params }) => ({
    constant: ({ F, S, getBranchById }) => {
      const val = parseNumber(params[0]);
      const branch = getBranchById(id)!;

      F.set(branch, branch, 1);
      S.set(branch, 0, val);
    },
  }),
};
