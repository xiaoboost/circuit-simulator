import { WorkerChildServer } from '@circuit/worker';

const server = new WorkerChildServer();

setTimeout(() => {
  server.send('setTimeout', 'init ok');
}, 200);
