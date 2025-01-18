import { style } from '@vanilla-extract/css';
import { Colors, Fonts } from 'src/styles/constant';

export const container = style({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  color: Colors.PrimaryText.toString(),
  fontFamily: Fonts.Default,
  fontSize: Fonts.DefaultSize,
});
