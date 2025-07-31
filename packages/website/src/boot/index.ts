import '../styles';
import '../plugins';
import './native';
import './polyfill';
import '@ant-design/v5-patch-for-react-19';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../layout/app';

createRoot(document.getElementById('root')!)
  .render(createElement(App));
