import { Path } from '@circuit/algorithm';
import { LINE_THICKNESS as rectWidth } from '@circuit/electronics';
import { RectSize } from './types';

export function getLineRect(path: Path) {
  const rects: RectSize[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    const left = Math.min(start[0], end[0]);
    const top = Math.min(start[1], end[1]);
    const right = Math.max(start[0], end[0]);
    const bottom = Math.max(start[1], end[1]);

    rects.push({
      x: left - rectWidth / 2,
      y: top - rectWidth / 2,
      height: (left === right) ? bottom - top + rectWidth : rectWidth,
      width: (left === right) ? rectWidth : right - left + rectWidth,
    });
  }

  return rects;
}
