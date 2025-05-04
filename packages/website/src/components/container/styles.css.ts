import { Colors, Fonts } from '@circuit/shared';
import { style } from '@vanilla-extract/css';

export const container = style({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  color: Colors.PrimaryText.toString(),
  fontFamily: Fonts.Default,
  fontSize: Fonts.DefaultSize,
});
