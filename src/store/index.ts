import { Watcher } from 'src/lib/subject';

export * from './types';

export const isRun = new Watcher(false);
