import {
  createScopeSymbol,
  RootScope,
  createPluginDefinitionWithScope,
  createReactHookWithScope,
} from '@circuit/inject';

export {
  createServiceKey,
  createSorter,
} from '@circuit/inject';

export {
  Watcher,
  useWatcher,
  useArrayWatcher,
  useObjectWatcher,
} from '@circuit/reactive';

export * from './react';

export const PainterScope = createScopeSymbol('Painter', RootScope);
const reactHook = createReactHookWithScope(PainterScope);
export const definePlugin = createPluginDefinitionWithScope(PainterScope);
export const useHook = reactHook.useHook;
export const useService = reactHook.useService;
export const useLifeCycle = reactHook.useLifeCycle;
