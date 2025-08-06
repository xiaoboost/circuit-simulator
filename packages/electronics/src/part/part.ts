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
import {
  PartStoreData,
  PartStructuredData,
  PartPinData,
  ElectronicKind,
} from '@circuit/types';
import { nanoid } from 'nanoid';
import {
  ElectronicName,
  ElectronicCategoryName,
} from './constant';
import { Electronics } from './prototype';

/** 创建引用编号 */
function createRefTag(pre: string, ids: string[]): string {
  let index = 1;

  const idMap = new Map(ids.map((id) => [id, true]));

  while (idMap.has(`${pre}_${index}`)) {
    index++;
  }

  return `${pre}_${index}`;
}

function createPartId(): string {
  return `_$part_${nanoid()}`;
}

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
export function transformPartStoreToStructureData(data: PartStoreData): PartStructuredData {
  return {
    ...data,
    id: createPartId(),
    position: Point.from(data.position),
    propertyValues: data.propertyValues ?? [],
    rotate: data.rotate ?? copyMatrix(RotateMatrixSet[Rotate.Same]),
  };
}

/** 转换器件状态数据为存储数据 */
export function transformPartStructureToStoreData(data: PartStructuredData): PartStoreData {
  const result: PartStoreData = {
    ...data,
    position: data.position.toData(),
    rotate: isMatrixNotRotate(data.rotate) ? undefined : data.rotate,
  };

  if (!result.propertyValues || result.propertyValues.length === 0) {
    delete result.propertyValues;
  }

  return result;
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
  const textDirectionLabel = Object.keys(prototype.textBias ?? {})[0] ?? 'Bottom';
  const textDirection = Direction[textDirectionLabel as DirectionLabel];
  const part: PartStructuredData = {
    id: createPartId(),
    kind,
    referenceTag: createRefTag(prototype.pre, parts.map((part) => part.referenceTag)),
    position: Point.from([0, 0]),
    rotate: [[1, 0], [0, 1]],
    propertyValues: prototype.properties.map((p) => ({
      ...p.default,
    })),
    textDirection,
  };

  return part;
}
