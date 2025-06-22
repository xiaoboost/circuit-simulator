import { definePlugin } from '../../../../context';
import { PROPERTY_INPUT, IPropertyInput } from '../../../../types';
import { IdInputRender, IdInputDescriptor, IdInputValue } from './render';

definePlugin(({ registerHook }) => {
  registerHook<IPropertyInput<IdInputValue, IdInputDescriptor>>(PROPERTY_INPUT, {
    name: 'painter',
    order: 1,
    match: (p) => p?.kind === 'id',
    Render: IdInputRender,
  });
});
