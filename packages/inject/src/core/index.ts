export { Watcher } from '@xiao-ai/utils';
export { useWatcher } from '@xiao-ai/utils/use';

export {
  createServiceKey,
  createPluginDefinitionWithScope,
  defineGlobalPlugin,
} from './define';

export {
  useServiceWithScope,
  useHookWithScope,
  createReactHookWithScope,
  useServiceWithGlobal,
  useHookWithGlobal,
} from './react';

export {
  createScope,
  useInjectInstall,
} from './installer';

export {
  RootScope,
  InjectContext,
} from './context';
