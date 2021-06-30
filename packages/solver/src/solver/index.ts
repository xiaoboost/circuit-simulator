import { Solver } from './solver';
import { SolveOption, SolverResult } from './types';

export * from './types';
export * from './solver';

/** 解算电路 */
export function solve(option: SolveOption): SolverResult {
  return new Solver(option).startSolve();
}
