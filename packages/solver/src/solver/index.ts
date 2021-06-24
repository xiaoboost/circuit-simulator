import { Solver } from './solver';
import { SolveOption } from './types';

export * from './types';

/** 求解电路 */
export function solve(option: SolveOption) {
  return new Solver(option).startSolve();
}
