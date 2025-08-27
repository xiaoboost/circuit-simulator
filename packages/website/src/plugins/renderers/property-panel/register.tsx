import React from 'react';
import { definePlugin } from '../../../context';
import { RIGHT_SIDEBAR_RENDER } from '../../../types';
import { PropertyPanelTitle } from './components';
import { PropertyPanelContent } from './content';

definePlugin(({ registerHook }) => {
  registerHook(RIGHT_SIDEBAR_RENDER, {
    name: 'propertyPanel',
    order: 1,
    title: <PropertyPanelTitle />,
    Render: PropertyPanelContent,
  });
});
