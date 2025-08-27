import { HistoryOutlined } from '@circuit/icons';
import React from 'react';
import { definePlugin } from '../../../context';
import { LEFT_SIDEBAR_RENDER } from '../../../types';

definePlugin(({ registerHook }) => {
  registerHook(LEFT_SIDEBAR_RENDER, {
    name: 'historyPanel',
    order: 2,
    icon: <HistoryOutlined />,
    title: '操作记录',
    Render: () => '空内容',
  });
});
