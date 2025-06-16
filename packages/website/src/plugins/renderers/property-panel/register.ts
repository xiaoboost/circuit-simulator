import { definePlugin } from '../../../context';
import { RIGHT_SIDEBAR_RENDER } from '../../../types';
import { PropertyPanelContent } from './content';
import { PropertyPanelTitle } from './title';

definePlugin(({ registerHook }) => {
  registerHook(RIGHT_SIDEBAR_RENDER, {
    name: 'propertyPanel',
    order: 1,
    title: PropertyPanelTitle,
    Render: PropertyPanelContent,
  });
});
