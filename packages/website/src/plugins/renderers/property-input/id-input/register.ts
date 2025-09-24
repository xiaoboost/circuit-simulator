import { definePlugin } from '../../../../context';
import { IPropertyInput } from '../../../../types';
import { IdInputRender as Render, Value, Descriptor } from './render';

definePlugin(({ registerHook }) => {
  registerHook<IPropertyInput<Value, Descriptor>>(IPropertyInput, {
    name: 'id-input',
    order: 1,
    match: (p) => p?.type === 'referenceTag',
    Render,
  });
});
