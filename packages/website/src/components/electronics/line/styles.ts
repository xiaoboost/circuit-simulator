import { createStyles } from 'src/styles';
import { MouseFocusClassName } from '@circuit/electronics';
import { Black, DarkGreen } from 'src/styles';

export const styles = createStyles({
  line: {
    color: Black,

    [`& .${MouseFocusClassName}`]: {
      strokeWidth: 0,
      fill: 'transparent',
      stroke: 'transparent',
    },

    '& path': {
      color: 'currentColor',
      stroke: 'currentColor',
    },
  },
  lineSelected: {
    color: DarkGreen,
  },
  lineFocus: {
    position: 'relative',
  },
});
