import { PartSolverData } from './types';
import { ElectronicKind } from '@circuit/electronics';
import { parseNumber } from '../utils/number';

export const data: PartSolverData = {
  kind: ElectronicKind.DcCurrentSource,
  iterative: ({ id, params }) => ({
    constant: ({ S, H, getBranchById }) => {
      const val = parseNumber(params[0]);
      const branch = getBranchById(id)!;

      H.set(branch, branch, 1);
      S.set(branch, 0, val);
    },
  }),
};
