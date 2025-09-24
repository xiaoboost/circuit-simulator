import React from 'react';
import { definePlugin } from '../../../context';
import { IRightSidebarRender } from '../../../types';
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
