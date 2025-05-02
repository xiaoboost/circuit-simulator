import { style, globalStyle } from '@vanilla-extract/css';

import Grid from './assets/circuit-grid.svg';

export const entry = style({
  backgroundImage: `url("${Grid}")`,
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: '#fff',
  backgroundSize: '20px',
  backgroundPosition: '-40px -40px',
  backgroundRepeat: 'repeat',
  userSelect: 'none',
  cursor: 'default',
  outline: 'none',
  overflow: 'hidden',
});

globalStyle(`${entry} svg`, {
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  stroke: 'Black',
  strokeWidth: '2',
  strokeLinecap: 'round',
  fill: 'transparent',
});
