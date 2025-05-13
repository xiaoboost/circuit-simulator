import { Colors } from '@circuit/shared';
import { style } from '@vanilla-extract/css';

export const divider = style({
  width: 1,
  height: 30,
  backgroundColor: Colors.Black.mix(Colors.White, 0.8).string(),
  margin: '0 8px',
});
