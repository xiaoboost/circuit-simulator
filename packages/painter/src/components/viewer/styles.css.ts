import { style } from '@vanilla-extract/css';

export const viewerWrapper = style({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
  overflow: 'hidden',
});
