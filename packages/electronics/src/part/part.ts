import {
  rotateVector,
  DirectionVectorSet,
  Point,
  Direction,
  type DirectionLabel,
  isMatrixNotRotate,
  copyMatrix,
  Rotate,
  RotateMatrixSet,
} from '@circuit/algorithm';
import {
  type PartStoreData,
  type PartStructuredData,
  type PartPinData,
  type ElectronicKind,
  type LineOrPartStructuredData,
} from '@circuit/types';
import { nanoid } from 'nanoid';
import {
  ElectronicName,
  ElectronicCategoryName,
} from './constant';
import { Electronics } from './prototype';

/** 器件类型 */
export function isPart(electronic: LineOrPartStructuredData): electronic is PartStructuredData {
  return 'kind' in electronic && 'referenceTag' in electronic && isPartId(electronic.id);
}

/** 器件编号 */
export function isPartId(id: string) {
  return /^_\$[pP]art_.+$/.test(id);
}

/** 创建引用编号 */
function createRefTag(pre: string, ids: string[]): string {
  let index = 1;

  const idMap = new Map(ids.map((id) => [id, true]));

  while (idMap.has(`${pre}_${index}`)) {
    index++;
  }

  return String(index);
}

function createPartId(): string {
  return `_$part_${nanoid()}`;
}

/** 拼接器件引用编号 */
export function joinPartReferenceTag(prefix: string, suffix: string): string {
  return `${prefix}_${suffix}`;
}

/** 获取器件完整引用编号 */
export function createPartReferenceTag(part: PartStructuredData): string {
  return joinPartReferenceTag(getPartPrototype(part.kind).pre, part.referenceTag);
}

/** 解析器件引用编号 */
export function parsePartReferenceTag(tag: string): [prefix: string, suffix: string] {
  const [prefix, ...rest] = tag.split('_');
  return [prefix, rest.join('_')];
}

/** 迭代器件所有引脚数据 */
export function getPartPins(part: PartStructuredData) {
  return getPartPrototype(part.kind).pins.map((_, index) => {
    return getPartPin(part, index);
  });
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
  parts: PartStructuredData[] = [],
): PartStructuredData {
  const prototype = getPartPrototype(kind);
  const textDirectionLabel = Object.keys(prototype.textBias ?? {})[0] ?? 'Bottom';
  const textDirection = Direction[textDirectionLabel as DirectionLabel];
  const part: PartStructuredData = {
    id: createPartId(),
    kind,
    referenceTag: createRefTag(prototype.pre, parts.map((part) => createPartReferenceTag(part))),
    position: Point.from([0, 0]),
    rotate: [[1, 0], [0, 1]],
    propertyValues: prototype.properties.map((p) => ({
      ...p.default,
    })),
    textDirection,
  };

  return part;
}

/** 创建多个器件 */
export function createPartsByKind(kinds: ElectronicKind[]): PartStructuredData[] {
  const parts: PartStructuredData[] = [];

  for (const kind of kinds) {
    parts.push(createPartByKind(kind, parts));
  }

  return parts;
}
