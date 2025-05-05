import { Fonts } from '@circuit/shared';
import { style } from '@vanilla-extract/css';
import { textHeight } from './constant';

export const text = style({
  whiteSpace: 'nowrap',
  fontSize: textHeight,
  fontFamily: Fonts.Mono,
  fill: 'currentColor',
  strokeWidth: 0,
});
