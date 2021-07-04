import { Watcher } from '@xiao-ai/utils';
import { SolveOption, SolverResult } from '@circuit/solver';
import { WorkerMainServer } from '@circuit/worker';

import { parts, lines } from './sheet';
import { end, step } from './config';
import { SolveEvent } from './constant';

import SolverWorker from './solver.worker.ts';

/** 电路数据 */
export type SolverData = SolverResult;

/** 上次模拟结果 */
export const data = new Watcher<SolverResult>({
  meters: [],
  times: [],
});

/** 求解子进程 */
const server = new WorkerMainServer(SolverWorker);

/** 求解 */
export async function solve(onProgress: (progress: number) => any) {
  server.on(SolveEvent.Progress, onProgress);

  const result = await server.send<SolverResult, SolveOption>(SolveEvent.Solve, {
    parts: parts.data.map((item) => item.toStructuredData()),
    lines: lines.data.map((item) => item.toStructuredData()),
    end: end.data,
    step: step.data,
  });

  server.unOn(SolveEvent.Progress, onProgress);
  data.setData(result);

  return result;
}
