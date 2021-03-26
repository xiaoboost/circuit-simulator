import { Watcher } from 'src/lib/subject';
import { Point } from 'src/lib/point';

export interface MapState {
  zoom: number;
  position: Point;
}

export const mapStateDefault: MapState = {
  zoom: 1,
  position: Point.from(0),
};

export const mapState = new Watcher(mapStateDefault);
