import { Point } from '@circuit/math';
import { Watcher } from '@xiao-ai/utils';

export interface State {
  zoom: number;
  position: Point;
}

export const state = new Watcher<State>({
  zoom: 1,
  position: Point.from(0),
});
