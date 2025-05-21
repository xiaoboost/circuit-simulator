import '../styles';
import './native';
import 'core-js/stable';
import '@ant-design/v5-patch-for-react-19';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from 'src/components/container';

createRoot(document.getElementById('root')!)
  .render(createElement(App));
