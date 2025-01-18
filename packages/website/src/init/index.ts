import '../styles';
import './native';
import 'core-js/stable';

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from 'src/components/container';

createRoot(document.getElementById('root')!)
  .render(createElement(App));
