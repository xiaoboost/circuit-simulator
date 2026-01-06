import { PainterScope } from '@circuit/contracts/painter';
import { createReactHookWithScope } from '@circuit/inject';

export * from './react';
export { PainterScope } from '@circuit/contracts/painter';
export { createSorter } from '@circuit/inject';

const reactHook = createReactHookWithScope(PainterScope);
export const useHook = reactHook.useHook;
export const useService = reactHook.useService;
export const useLifeCycle = reactHook.useLifeCycle;
