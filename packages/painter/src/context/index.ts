import {
  createScopeSymbol,
  RootScope,
  createPluginDefinitionWithScope,
  createReactHookWithScope,
} from '@circuit/inject';

export {
  createServiceKey,
  Watcher,
  useWatcher,
} from '@circuit/inject';

export const PainterScope = createScopeSymbol('Painter', RootScope);
const reactHook = createReactHookWithScope(PainterScope);
export const definePlugin = createPluginDefinitionWithScope(PainterScope);
export const useHook = reactHook.useHook;
export const useService = reactHook.useService;
