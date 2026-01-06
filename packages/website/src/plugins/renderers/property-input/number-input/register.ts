import { IPropertyInput, definePlugin } from '@circuit/contracts/global';
import { PropertyKind } from '@circuit/types';
import { NumberInputRender as Render, Descriptor, Value } from './render';

definePlugin(({ registerHook }) => {
  registerHook<IPropertyInput<Value, Descriptor>>(IPropertyInput, {
    name: 'number-input',
    order: 1,
    match: (p) => p?.type === 'params' && p.kind === PropertyKind.Number,
    Render,
  });
});
