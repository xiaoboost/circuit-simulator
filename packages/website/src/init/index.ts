import '../styles';
import './native';
import 'core-js/stable';

import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

import { App } from 'src/components/container';

createRoot(document.getElementById('root')!)
  .render(createElement(App));
