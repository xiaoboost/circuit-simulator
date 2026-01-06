import { ILeftSidebarRender, definePlugin } from '@circuit/contracts/global';
import { PlusOutlined } from '@circuit/icons';
import React from 'react';
import { AddElectronicPanelRender } from './render';

definePlugin(({ registerHook }) => {
  registerHook(ILeftSidebarRender, {
    name: 'addElectronicPanel',
    order: 1,
    icon: <PlusOutlined />,
    title: '添加元件',
    Render: AddElectronicPanelRender,
  });
});
