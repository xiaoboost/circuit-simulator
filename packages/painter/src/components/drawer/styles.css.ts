import { style } from '@vanilla-extract/css';

import Grid from './assets/circuit-grid.svg';

export const drawerWrapper = style({
  position: 'absolute',
  top: '0',
  left: '0',
  backgroundImage: `url("${Grid}")`,
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
  backgroundSize: '20px',
  backgroundPosition: '-40px -40px',
  backgroundRepeat: 'repeat',
  overflow: 'hidden',
  stroke: 'Black',
  strokeWidth: '2',
  strokeLinecap: 'round',
  fill: 'transparent',
});
