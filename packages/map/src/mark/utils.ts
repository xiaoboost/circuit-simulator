import { MarkMap } from '../map';
import type { LineMark, LineStructureData } from './line';
import type { LineCoverMark, LineCoverStructureData } from './line-cover';
import type { LineCrossMark, LineCrossStructureData } from './line-cross';
import type { LinePointMark, LinePointStructureData } from './line-point';
import type { PartMark, PartStructureData } from './part';
import type { PartPinMark, PartPinStructureData } from './part-pin';
import type { PartPinLineMark, PartPinLineStructureData } from './part-pin-line';
import {
  MarkKind,
  MarkConstructorMap,
  MarkConstructor,
  MarkStructureData,
} from './types';

/** 构造器缓存 */
const ClassMap: MarkConstructorMap = {} as any;

/** 记录类缓存 */
export function setClass(name: keyof MarkConstructorMap) {
  return function(target: MarkConstructor) {
    ClassMap[name] = target as any;
  };
}

/** 获取构造函数 */
export function getMarkConstructor<T extends keyof MarkConstructorMap>(name: T) {
  return ClassMap[name];
}

export function getMarkFromData(map: MarkMap, data: LineStructureData): LineMark;
export function getMarkFromData(map: MarkMap, data: LinePointStructureData): LinePointMark;
export function getMarkFromData(map: MarkMap, data: LineCoverStructureData): LineCoverMark;
export function getMarkFromData(map: MarkMap, data: LineCrossStructureData): LineCrossMark;
export function getMarkFromData(map: MarkMap, data: PartStructureData): PartMark;
export function getMarkFromData(map: MarkMap, data: PartPinStructureData): PartPinMark;
export function getMarkFromData(map: MarkMap, data: PartPinLineStructureData): PartPinLineMark;
export function getMarkFromData(map: MarkMap, data: MarkStructureData) {
  if (data.kind === MarkKind.Line) {
    const LineMark = getMarkConstructor('LineMark');
    return new LineMark(map, data as any);
  }

  if (data.kind === MarkKind.LinePoint) {
    const LinePointMark = getMarkConstructor('LinePointMark');
    return new LinePointMark(map, data as any);
  }

  if (data.kind === MarkKind.LineCross) {
    const LineCrossMark = getMarkConstructor('LineCrossMark');
    return new LineCrossMark(map, data as any);
  }

  if (data.kind === MarkKind.LineCover) {
    const LineCoverMark = getMarkConstructor('LineCoverMark');
    return new LineCoverMark(map, data as any);
  }

  if (data.kind === MarkKind.Part) {
    const PartMark = getMarkConstructor('PartMark');
    return new PartMark(map, data as any);
  }

  if (data.kind === MarkKind.PartPin) {
    const PartPinMark = getMarkConstructor('PartPinMark');
    return new PartPinMark(map, data as any);
  }

  if (data.kind === MarkKind.PartPinLine) {
    const PartPinLineMark = getMarkConstructor('PartPinLineMark');
    return new PartPinLineMark(map, data as any);
  }

  throw new Error('节点数据错误');
}
