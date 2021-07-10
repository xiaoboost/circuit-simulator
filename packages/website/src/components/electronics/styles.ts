import { Direction } from '@circuit/math';
import { createStyles } from 'src/styles';
import { MouseFocusClassName } from '@circuit/electronics';
import { Black, FontText, White, DarkGreen, movePartCursor, drawLineCursor } from 'src/styles';

export const partStyles = createStyles({
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
  [Direction[Direction.Top]]: {
    textAnchor: 'middle',
  },
  [Direction[Direction.Bottom]]: {
    textAnchor: 'middle',
  },
  [Direction[Direction.Left]]: {
    textAnchor: 'end',
  },
  [Direction[Direction.Right]]: {
    textAnchor: 'start',
  },
});

export const lineStyles = createStyles({
  line: {
    color: Black,

    '& path': {
      color: 'currentColor',
      stroke: 'currentColor',
    },
    [`& .${MouseFocusClassName}`]: {
      strokeWidth: 0,
      fill: 'transparent',
      stroke: 'transparent',
    },
    [`& .${MouseFocusClassName}:hover`]: {
      cursor: movePartCursor,
    },
  },
  lineSelected: {
    color: DarkGreen,
  },
  lineFocus: {
    position: 'relative',
  },
});

export const pointStyles = createStyles({
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
