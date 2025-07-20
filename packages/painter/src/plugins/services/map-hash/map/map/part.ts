import {
  Point,
  MarginBox,
  RotateMatrix,
} from '@circuit/algorithm';
import {
  getPartPins,
  getPartPrototype,
} from '@circuit/electronics';
import { PartStructuredData } from '@circuit/types';
import { MarkMap, MarkKind } from '../../../../../types';
import {
  isPart,
  isPartPin,
  isPartPinLine,
  deleteLine,
  addConnect,
  deleteConnect,
} from '../mark';
import { get, remove, set } from './map';

/**
 * 获取内边框顶点
 * @param position 位置
 * @param margin 边框
 * @param rotate 旋转
 * @returns 边框顶点：左上、右上、右下、左下
 */
function getPaddingRect(
  position: Point,
  margin: MarginBox,
  rotate: RotateMatrix,
) {
  const endPoint = [[-margin[3], -margin[0]], [margin[1], margin[2]]];
  const data = endPoint.map((point) => Point.prototype.rotate.call(point, rotate));
  const minX = Math.min(data[0][0], data[1][0]);
  const maxX = Math.max(data[0][0], data[1][0]);
  const minY = Math.min(data[0][1], data[1][1]);
  const maxY = Math.max(data[0][1], data[1][1]);

  return [
    Point.from([minX, minY]).trunc(20).add(position),
    Point.from([maxX, minY]).trunc(20).add(position),
    Point.from([maxX, maxY]).trunc(20).add(position),
    Point.from([minX, maxY]).trunc(20).add(position),
  ];
}

/** 迭代器件内边框内所有节点 */
function getPaddingPoint(data: PartStructuredData) {
  const { margin } = getPartPrototype(data.kind);
  const [point1, point2, , point4] = getPaddingRect(data.position, margin, data.rotate);
  const result: Point[] = [];

  for (const pointY of point1.toDestination(point4, 20)) {
    const numberY = pointY[1];
    const start = new Point(point1[0], numberY);
    const end = new Point(point2[0], numberY);

    for (const point of start.toDestination(end, 20)) {
      result.push(point);
    }
  }

  return result;
}

/** 设置器件图纸数据 */
export function setPartMark(data: PartStructuredData, map: MarkMap) {
  const pins = Array.from(getPartPins(data));
  const setPartMark = (position: Point, pin?: number) => {
    const oldMark = get(map, position);

    if (oldMark) {
      throw new Error('器件节点必须放置在`空位`上');
    }
    else if (typeof pin === 'number') {
      set(map, {
        kind: MarkKind.PartPin,
        id: data.id,
        pin,
        position,
      });
    }
    else {
      set(map, {
        kind: MarkKind.Part,
        id: data.id,
        position,
      });
    }
  };

  for (const pin of pins) {
    setPartMark(pin.position, pin.index);
  }

  for (const point of getPaddingPoint(data)) {
    if (pins.every((pin) => !pin.position.isEqual(point))) {
      setPartMark(point);
    }
  }
}

/** 删除器件图纸数据 */
export function deletePartMark(data: PartStructuredData, map: MarkMap) {
  const deletePointMark = (position: Point) => {
    const mark = get(map, position);

    if (!mark) {
      return;
    }

    if (isPartPin(mark) || isPart(mark)) {
      remove(map, position);
      return;
    }
    else if (isPartPinLine(mark)) {
      deleteLine(mark);
    }
    else {
      throw new Error(`当前位置不是器件：[${position[0]}, ${position[1]}]`);
    }
  };

  for (const point of getPaddingPoint(data)) {
    deletePointMark(point);
  }

  for (const pin of getPartPins(data)) {
    deletePointMark(pin.position);
  }
}
