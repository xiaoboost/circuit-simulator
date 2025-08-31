import type { Point } from '@circuit/algorithm';
import { getPartPins, createPartReferenceTag } from '@circuit/electronics';
import type { PartStructuredData } from '@circuit/types';

/** 器件与引脚 */
export interface PartWithPin {
  /** 元件编号 */
  id: string;
  /** 元件引脚 */
  pin: number;
  /** 元件引用编号 */
  tag: string;
}

/** 按照坐标查找器件引脚 */
export function findPartPin(point: Point, parts: PartStructuredData[]) {
  let result: PartWithPin | undefined = undefined;

  for (const part of parts) {
    for (const pin of getPartPins(part)) {
      if (pin.position.isEqual(point)) {
        result = {
          id: part.id,
          pin: pin.index,
          tag: createPartReferenceTag(part),
        };
        break;
      }
    }
  }

  return result;
}
