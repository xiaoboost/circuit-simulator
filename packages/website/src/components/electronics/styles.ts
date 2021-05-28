import { Direction } from '@circuit/math';
import { createDynamicStyles } from 'src/lib/styles';
import { MouseFocusClassName } from './parts/constant';
import { Black, FontText, White, movePartCursor, drawLineCursor } from 'src/lib/styles';

export const part = createDynamicStyles({
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
  partText: {
    whiteSpace: 'nowrap',
    fontFamily: FontText,
    fill: 'currentColor',
    strokeWidth: 0,
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

export const point = createDynamicStyles({
  point: {
    '& rect': {
      strokeWidth: 0,
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
});
