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
  createScopeSymbol,
  useInjectInstall,
} from './installer';

export {
  RootScope,
  InjectContext,
} from './context';

export {
  type ServiceTypeWithKey,
  type IPluginInstallerContext,
} from './types';
