import {
  rotateVector,
  DirectionVectorSet,
  Point,
  isMatrixEqual,
} from '@circuit/algorithm';
import { ElectronicCategoryName, ElectronicName } from './constant';
import { Electronics } from './prototype';
import { PartStoreData, PartStructuredData, PartPinData, ElectronicKind } from './types';
import { getMarginVertex } from './utils';

/** 迭代器件所有引脚数据 */
export function* getPartPins(part: PartStructuredData) {
  for (let i = 0; i < getPartPrototype(part.kind).pins.length; i++) {
    yield getPartPin(part, i);
  }
}

/** 获取器件原型 */
export function getPartPrototype(kind: ElectronicKind) {
  const prototype = Electronics[kind];

  if (!prototype) {
    throw new Error(`未知器件类型: ${kind}`);
  }

  return prototype;
}

/** 获取器件信息 */
export function getPartInfo(kind: ElectronicKind) {
  return {
    name: ElectronicName[kind],
    category: ElectronicCategoryName[getPartPrototype(kind).category],
  };
}

/** 转换器件存储数据为状态数据 */
export function transformPartStoreToStateData(data: PartStoreData): PartStructuredData {
  return {
    ...data,
    rotate: data.rotate ?? [[1, 0], [0, 1]],
  };
}

/** 转换器件状态数据为存储数据 */
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

/** 获取器件节点数据 */
export function getPartPin(data: PartStructuredData, pin: number): PartPinData {
  const prototype = getPartPrototype(data.kind);
  const pinData = prototype.pins[pin];
  const pinPosition = rotateVector(pinData.position, data.rotate).add(data.position);
  const result: PartPinData = {
    index: pin,
    position: pinPosition,
    origin: pinPosition,
    direction: Point.prototype.rotate.call(DirectionVectorSet[pinData.direction], data.rotate),
  };

  return result;
}
