import '../styles';
import './native';
import 'core-js/stable';
import '@ant-design/v5-patch-for-react-19';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../components/layout';

createRoot(document.getElementById('root')!)
  .render(createElement(App));
