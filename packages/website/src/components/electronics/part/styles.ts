import { createStyles } from 'src/styles';
import { MouseFocusClassName } from '@circuit/electronics';
import { Black, FontText, DarkGreen, movePartCursor } from 'src/styles';

export const styles = createStyles({
  part: {
    color: Black,

    [`& .${MouseFocusClassName}`]: {
      strokeWidth: 0,
      fill: 'transparent',
      stroke: 'transparent',
    },

    '&:hover': {
      cursor: movePartCursor,
    },
  },
  partSelected: {
    color: DarkGreen,
  },
  partText: {
    whiteSpace: 'nowrap',
    fontFamily: FontText,
    fill: 'currentColor',
    strokeWidth: 0,
  },
  partFocus: {
    position: 'relative',
  },
});
