import { WorkerChildServer } from '@circuit/worker';
import { solve, SolveOption, SolverResult } from '@circuit/solver';
import { SolveEvent } from './constant';

const server = new WorkerChildServer();

server.on<SolveOption, SolverResult>(SolveEvent.Solve, (data) => {
  return solve({
    ...data,
    onProgress(progress) {
      server.send(SolveEvent.Progress, progress);
    },
  });
});
