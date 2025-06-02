import { Point } from '@circuit/algorithm';
import {
  PartStructuredData,
  getPaddingPoint,
  getPartPins,
} from '@circuit/electronics';
import { MarkKind, MarkMap } from '@circuit/map';

/** 设置器件图纸数据 */
export function setPartMark(data: PartStructuredData, map: MarkMap) {
  const pins = Array.from(getPartPins(data));
  const setPartMark = (position: Point, pin?: number) => {
    const oldMark = map.get(position);

    if (oldMark) {
      throw new Error('器件节点必须放置在`空位`上');
    }
    else if (typeof pin === 'number') {
      map.set(position, {
        kind: MarkKind.PartPin,
        part: data.id,
        pin,
      });
    }
    else {
      map.set(position, {
        kind: MarkKind.Part,
        part: data.id,
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

  for (const point of getPaddingPoint(data)) {
    deletePointMark(point);
  }

  for (const pin of getPartPins(data)) {
    deletePointMark(pin.position);
  }
}
