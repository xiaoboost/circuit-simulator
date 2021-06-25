import { Solver } from './solver';
import { SolveOption, SolverResult } from './types';

export * from './types';

/** 解算电路 */
export function solve(option: SolveOption): Promise<SolverResult> {
  return new Solver(option).startSolve();
}
