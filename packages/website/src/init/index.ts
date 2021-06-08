import '../styles';
import './native';
import 'core-js/stable';

import { render } from 'react-dom';
import { createElement } from 'react';

import { App } from 'src/components/container';

render(
  createElement(App),
  document.getElementById('root')!,
);
