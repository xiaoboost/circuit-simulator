import type { Point } from '@circuit/algorithm';
import { getPartPins, createPartReferenceTag } from '@circuit/electronics';
import type { PartStructuredData, PartWithPin } from '@circuit/types';

/** 按照坐标查找器件引脚 */
export function findPartPin(point: Point, parts: PartStructuredData[]) {
  let result: PartWithPin | undefined = undefined;

  for (const part of parts) {
    for (const pin of getPartPins(part)) {
      if (pin.position.isEqual(point)) {
        result = {
          data: part,
          pin: pin.index,
          tag: createPartReferenceTag(part),
        };
        break;
      }
    }
  }

  return result;
}
