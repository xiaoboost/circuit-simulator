import { createUseStyles } from 'react-jss';
import { Direction } from 'src/math';
import { Black, FontText, White } from 'src/lib/styles';

import DrawLine from 'src/assets/cursor/draw-line.svg';

export const part = createUseStyles({
  part: {
    color: Black,

    '& .focus-transparent': {
      strokeWidth: 0,
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

export const point = createUseStyles({
  point: {
    '& rect': {
      strokeWidth: 0,
    },
    '&:hover': {
      cursor: `url("${DrawLine}") 16 16, crosshair`,
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
