import { useMemo } from 'react';
import { Line } from 'src/electronics';

export function usePathRects(line: Line) {
  return useMemo(() => {
    const ans = [], wide = 14;

    for (let i = 0; i < line.path.length - 1; i++) {
      const start = line.path[i], end = line.path[i + 1];
      const left = Math.min(start[0], end[0]);
      const top = Math.min(start[1], end[1]);
      const right = Math.max(start[0], end[0]);
      const bottom = Math.max(start[1], end[1]);

      ans.push({
        x: left - wide / 2,
        y: top - wide / 2,
        height: (left === right) ? bottom - top + wide : wide,
        width: (left === right) ? wide : right - left + wide,
      });
    }

    return ans;
  }, [line.path.stringify()])
}
