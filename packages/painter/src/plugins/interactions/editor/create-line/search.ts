import { Point } from '@circuit/algorithm';
import { PathSearcherOptions, PathSearcher } from '../algorithm';

export function createDrawLineSearcher(options: PathSearcherOptions): PathSearcher {
  return (end, endBias = Point.from([0, 0])) => {
    return [];
  };
}
