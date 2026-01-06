import { IRightSidebarRender, definePlugin } from '@circuit/contracts/global';
import React from 'react';
import { PropertyPanelTitle } from './components';
import { PropertyPanelContent } from './content';

definePlugin(({ registerHook }) => {
  registerHook(IRightSidebarRender, {
    name: 'propertyPanel',
    order: 1,
    title: <PropertyPanelTitle />,
    Render: PropertyPanelContent,
  });
});
