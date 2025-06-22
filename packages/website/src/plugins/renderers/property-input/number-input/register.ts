import { PropertyKind } from '@circuit/types';
import { definePlugin } from '../../../../context';
import { PROPERTY_INPUT, IPropertyInput } from '../../../../types';
import { NumberInputRender as Render, Descriptor, Value } from './render';

definePlugin(({ registerHook }) => {
  registerHook<IPropertyInput<Value, Descriptor>>(PROPERTY_INPUT, {
    name: 'number-input',
    order: 1,
    match: (p) => p?.type === 'params' && p.kind === PropertyKind.Number,
    Render,
  });
});
