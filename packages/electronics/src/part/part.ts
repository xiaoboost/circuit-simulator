import {
  rotateVector,
  DirectionVectorSet,
  Point,
  isMatrixEqual,
} from '@circuit/algorithm';
import { ElectronicKind } from '../types';
import { Electronics } from './prototype';
import { PartStoreData, PartStructuredData, PartPinData } from './types';
import { getMarginVertex } from './utils';

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

/** 迭代器件内边距节点 */
export function* getPaddingPoint(data: PartStructuredData) {
  const { padding } = getPartPrototype(data.kind);
  const [point1, point2, , point4] = getMarginVertex(data.position, padding, data.rotate);

  for (const pointY of point1.toDestination(point4, 20)) {
    const numberY = pointY[1];
    const start = new Point(point1[0], numberY);
    const end = new Point(point2[0], numberY);

    for (const point of start.toDestination(end, 20)) {
      yield point;
    }
  }
}
