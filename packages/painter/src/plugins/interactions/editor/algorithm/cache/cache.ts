import {
  Point,
  type PathWithPoint,
} from '@circuit/algorithm';

/**
 * 路径缓存
 */
export class PathCache {
  private pointCache = new Map<string, PathWithPoint>();

  private getPointKey(key: Point) {
    return key.join(',');
  }

  set(key: Point, value: PathWithPoint) {
    this.pointCache.set(this.getPointKey(key), value);
  }

  get(key: Point) {
    return this.pointCache.get(this.getPointKey(key));
  }

  has(key: Point) {
    return this.pointCache.has(this.getPointKey(key));
  }

  clear() {
    this.pointCache.clear();
  }
}
