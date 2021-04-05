import { createUseStyles } from 'react-jss';

import DrawLine from '../assets/cursor/draw-line.svg';
import MoveMap from '../assets/cursor/move-map.svg';

function getCursorStyle(url: string) {
  return `url("${url}") 16 16, crosshair`;
}

export const styles = createUseStyles({
  drawLine: {
    cursor: getCursorStyle(DrawLine),
  },
  moveMap: {
    cursor: getCursorStyle(MoveMap),
  },
});
