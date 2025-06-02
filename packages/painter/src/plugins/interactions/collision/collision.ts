import { Rect, Point } from '@circuit/algorithm';

/** 检测点是否在矩形内 */
export function pointInRect(point: Point, rect: Rect) {
  return (
    point[0] >= rect.x &&
    point[0] <= rect.x + rect.width &&
    point[1] >= rect.y &&
    point[1] <= rect.y + rect.height
  );
}

/** 检测两个 Rect 是否相交 */
export function collision(rect1: Rect, rect2: Rect) {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect1.x > rect2.x + rect2.width ||
    rect1.y + rect1.height < rect2.y ||
    rect1.y > rect2.y + rect2.height
  );
}
