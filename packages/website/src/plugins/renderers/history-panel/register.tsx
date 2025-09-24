import { HistoryOutlined } from '@circuit/icons';
import React from 'react';
import { definePlugin } from '../../../context';
import { ILeftSidebarRender } from '../../../types';

definePlugin(({ registerHook }) => {
  registerHook(ILeftSidebarRender, {
    name: 'historyPanel',
    order: 2,
    icon: <HistoryOutlined />,
    title: '操作记录',
    Render: () => '空内容',
  });
});
