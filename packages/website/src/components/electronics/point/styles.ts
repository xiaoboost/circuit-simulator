import { createStyles } from 'src/styles';
import { MouseFocusClassName } from '@circuit/electronics';
import { White, drawLineCursor } from 'src/styles';

export const styles = createStyles({
  point: {
    [`& .${MouseFocusClassName}`]: {
      strokeWidth: 0,
      fill: 'transparent',
      stroke: 'transparent',
    },
    '&:hover': {
      cursor: drawLineCursor,
    },
  },
  solidCircle: {
    fill: 'currentColor',
    stroke: 'currentColor',
  },
  hollowCircle: {
    fill: White,
    stroke: 'currentColor',
  },
  dashCircle: {
    fill: White,
    stroke: 'currentColor',
    strokeDasharray: '1.5 4',
  },
});
