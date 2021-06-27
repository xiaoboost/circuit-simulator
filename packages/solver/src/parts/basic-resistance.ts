import { PartSolverData } from './types';
import { ElectronicKind } from '@circuit/electronics';
import { parseNumber } from '../utils/number';

export const data: PartSolverData = {
  kind: ElectronicKind.Resistance,
  iterative: ({ id, params }) => ({
    constant: ({ F, H, getBranchById }) => {
      const val = parseNumber(params[0]);
      const branch = getBranchById(id)!;

      F.set(branch, branch, -1);
      H.set(branch, branch, val);
    },
  }),
};
