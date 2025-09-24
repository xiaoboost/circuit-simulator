import { PlusOutlined } from '@circuit/icons';
import React from 'react';
import { definePlugin } from '../../../context';
import { ILeftSidebarRender } from '../../../types';
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
