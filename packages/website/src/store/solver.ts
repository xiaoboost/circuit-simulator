import { SolverData } from './types';
import { Watcher } from '@xiao-ai/utils';
import { WorkerMainServer } from '@circuit/worker';

import Solver from './solver.worker.ts';

/** 上次模拟结果 */
export const solverData = new Watcher<SolverData>({
  meters: [],
  times: [],
  oscilloscopes: [],
});

/** 求解子进程 */
const server = new WorkerMainServer(Solver);

server.on('setTimeout', (data) => {
  console.log(data);
});
