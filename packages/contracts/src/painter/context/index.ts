import {
  createScopeSymbol,
  RootScope,
  createPluginDefinitionWithScope,
} from '@circuit/inject';

export const PainterScope = createScopeSymbol('Painter', RootScope);
export const definePlugin = createPluginDefinitionWithScope(PainterScope);
