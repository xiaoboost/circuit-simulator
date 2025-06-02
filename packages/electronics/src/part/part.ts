import {
  rotateVector,
  DirectionVectorSet,
  Point,
  Direction,
  DirectionLabel,
  isMatrixNotRotate,
  copyMatrix,
  Rotate,
  RotateMatrixSet,
} from '@circuit/algorithm';
import { createId } from '../utils';
import {
  ElectronicName,
  ElectronicCategoryName,
  NewElectronicPosition,
} from './constant';
import { Electronics } from './prototype';
import {
  PartStoreData,
  PartStructuredData,
  PartPinData,
  ElectronicKind,
} from './types';
import {
  getPaddingRect,
} from './utils';

/** 迭代器件所有引脚数据 */
export function *getPartPins(part: PartStructuredData) {
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
    position: Point.from(data.position),
    rotate: data.rotate ?? copyMatrix(RotateMatrixSet[Rotate.Same]),
  };
}

/** 转换器件状态数据为存储数据 */
export function transformPartStateToStoreData(data: PartStructuredData): PartStoreData {
  return {
    ...data,
    position: data.position.toData(),
    rotate: isMatrixNotRotate(data.rotate) ? undefined : data.rotate,
  };
}

/** 迭代器件内边框内所有节点 */
export function *getPaddingPoint(data: PartStructuredData) {
  const { margin } = getPartPrototype(data.kind);
  const [point1, point2, , point4] = getPaddingRect(data.position, margin, data.rotate);

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
  const pinOrigin = rotateVector(pinData.position, data.rotate);
  const pinPosition = pinOrigin.add(data.position);
  const result: PartPinData = {
    index: pin,
    position: pinPosition,
    origin: pinOrigin,
    direction: Point.prototype.rotate.call(DirectionVectorSet[pinData.direction], data.rotate),
  };

  return result;
}

/** 创建新器件 */
export function createPartByKind(
  kind: ElectronicKind,
  parts: PartStructuredData[],
): PartStructuredData {
  const prototype = getPartPrototype(kind);
  const id = createId(prototype.pre, parts.map((part) => part.id));
  const textDirectionLabel = Object.keys(prototype.textBias ?? {})[0] ?? 'Bottom';
  const textDirection = Direction[textDirectionLabel as DirectionLabel];
  const part: PartStructuredData = {
    id,
    kind,
    position: Point.from(NewElectronicPosition),
    rotate: [[1, 0], [0, 1]],
    params: prototype.params.map((param) => param.default),
    textDirection,
  };

  return part;
}
