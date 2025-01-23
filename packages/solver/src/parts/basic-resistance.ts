import { parseNumber } from '../utils/number';
import { IterativeCreation } from './types';

export const data: IterativeCreation = ({ id, params }) => ({
  constant: ({ F, H, getBranchById }) => {
    const val = parseNumber(params[0]);
    const branch = getBranchById(id)!;
    F.set(branch, branch, -1);
    H.set(branch, branch, val);
  },
});
