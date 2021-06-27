import { IterativeCreation } from './types';
import { parseNumber } from '../utils/number';

export const data: IterativeCreation = ({ id, params }) => ({
  constant: ({ F, S, getBranchById }) => {
    const val = parseNumber(params[0]);
    const branch = getBranchById(id)!;

    F.set(branch, branch, 1);
    S.set(branch, 0, val);
  },
});
