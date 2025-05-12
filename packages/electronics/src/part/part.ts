import {
  rotateVector,
  DirectionVectorSet,
  Point,
  isMatrixEqual,
} from '@circuit/algorithm';
import { ElectronicKind } from '../types';
import { Electronics } from './prototype';
import { PartStoreData, PartStructuredData, PartPinData } from './types';

export function* getPartPins(part: PartStructuredData) {
  const prototype = Electronics[part.kind];
  const { rotate, position } = part;

  for (let i = 0; i < prototype.pins.length; i++) {
    const pin = prototype.pins[i];
    const pinPosition = rotateVector(pin.position, rotate).add(position);
    const data: PartPinData = {
      index: i,
      position: pinPosition,
      origin: pinPosition,
      direction: Point.prototype.rotate.call(DirectionVectorSet[pin.direction], rotate),
    };

    yield data;
  }
}

export function getPartPrototype(kind: ElectronicKind) {
  const prototype = Electronics[kind];

  if (!prototype) {
    throw new Error(`未知器件类型: ${kind}`);
  }

  return prototype;
}

export function transformPartStoreToStateData(data: PartStoreData): PartStructuredData {
  return {
    ...data,
    rotate: data.rotate ?? [[1, 0], [0, 1]],
  };
}

export function transformPartStateToStoreData(data: PartStructuredData): PartStoreData {
  if (isMatrixEqual(data.rotate, [[1, 0], [0, 1]])) {
    return {
      ...data,
      rotate: undefined,
    };
  }

  return data;
}
