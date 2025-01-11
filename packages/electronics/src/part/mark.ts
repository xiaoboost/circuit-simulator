import { MarkKind } from '@circuit/map';
import { Point } from '@circuit/math';
import { SheetContext } from '../base';
import { ElectronicKind } from '../types';
import { PartProps } from './props';
import { PartData } from './types';

export class PartMarker extends PartProps {
  constructor(kind: ElectronicKind | PartData, context?: SheetContext) {
    super(kind, context);
  }

  /** 迭代器件内边距节点 */
  *#getPaddingPoint() {
    const [point1, point2, , point4] = this.padding;

    for (const pointY of point1.toDestination(point4, 20)) {
      const numberY = pointY[1];
      const start = new Point(point1[0], numberY);
      const end = new Point(point2[0], numberY);

      for (const point of start.toDestination(end, 20)) {
        yield point;
      }
    }
  }

  /** 设置图纸数据 */
  setMark() {
    const { sheet: { markMap: map }, id, points } = this;
    const setPartMark = (position: Point, pin?: number) => {
      const oldMark = map.get(position);

      if (oldMark) {
        throw new Error('器件引脚必须放置在`空位`上');
      }
      else if (typeof pin === 'number') {
        map.set(position, {
          kind: MarkKind.PartPin,
          part: id,
          pin,
        });
      }
      else {
        map.set(position, {
          kind: MarkKind.Part,
          part: id,
        });
      }
    };

    for (const point of this.#getPaddingPoint()) {
      setPartMark(point);
    }

    for (let i = 0; i < points.length; i++) {
      setPartMark(points[i].position, i);
    }
  }

  /** 移除图纸数据 */
  deleteMark() {
    const { sheet: { markMap: map }, points } = this;
    const deletePointMark = (position: Point) => {
      const mark = map.get(position);

      if (!mark) {
        return;
      }

      if (mark.isPartPin() || mark.isPart()) {
        map.delete(position);
        return;
      }
      else if (mark.isPartPinLine()) {
        mark.deletePin();
      }
      else {
        throw new Error(`当前位置不是器件：[${position[0]}, ${position[1]}]`);
      }
    };

    for (const point of this.#getPaddingPoint()) {
      deletePointMark(point);
    }

    for (const point of points) {
      deletePointMark(point.position);
    }
  }

  /**
   * 是否被占用
   *
   * @description 器件范围内没有任何坐标被占用
   * @param {Point} movement 当前元件坐标偏移量
   */
  isOccupied(movement = Point.from([0, 0])) {
    const { sheet: { markMap: map }, points } = this;

    for (const point of this.#getPaddingPoint()) {
      if (map.has(point.add(movement))) {
        return true;
      }
    }

    for (const { position: point } of points) {
      if (map.has(point.add(movement))) {
        return true;
      }
    }

    return false;
  }
}
