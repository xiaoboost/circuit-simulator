import { PlusOutlined } from '@circuit/icons';
import React from 'react';
import { definePlugin } from '../../../context';
import { LEFT_SIDEBAR_RENDER } from '../../../types';
import { AddElectronicPanelRender } from './render';

definePlugin(({ registerHook }) => {
  registerHook(LEFT_SIDEBAR_RENDER, {
    name: 'addElectronicPanel',
    order: 1,
    icon: <PlusOutlined />,
    title: '添加元件',
    Render: AddElectronicPanelRender,
  });
});
