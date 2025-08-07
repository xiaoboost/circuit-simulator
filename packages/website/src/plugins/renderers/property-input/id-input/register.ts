import { definePlugin } from '../../../../context';
import { PROPERTY_INPUT, IPropertyInput } from '../../../../types';
import { IdInputRender as Render, Value, Descriptor } from './render';

definePlugin(({ registerHook }) => {
  registerHook<IPropertyInput<Value, Descriptor>>(PROPERTY_INPUT, {
    name: 'id-input',
    order: 1,
    match: (p) => p?.type === 'referenceTag',
    Render,
  });
});
