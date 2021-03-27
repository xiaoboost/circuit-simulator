import { ElectronicKind } from './types';
import { Watcher } from 'src/lib/subject';

import type { Line } from './line';
import type { Part } from './part';

/** 全局编号 */
let _id = 0;

/** 全部导线 */
export const lines = new Watcher<Line[]>([]);
/** 全部器件 */
export const parts = new Watcher<Part[]>([]);
/** 全局元件速查表 */
const ElectronicHash: Record<number, Electronic | undefined> = {};

function getElectronics(isLine = true) {
  return Object
    .values(ElectronicHash)
    .filter((item): item is Line => (
      isLine
        ? item?.kind === ElectronicKind.Line
        : item?.kind !== ElectronicKind.Line
    ));
}

function updateData() {
  lines.setData(getElectronics(true));
  lines.setData(getElectronics(false));
}

export class Electronic {
  /** 元件编号 */
  readonly id = _id++;
  /** 元件类型 */
  readonly kind: ElectronicKind;
  /** 元件的连接表 */
  connect: string[] = [];

  constructor(kind: ElectronicKind) {
    this.kind = kind;
  }

  deleteSelf() {
    Reflect.deleteProperty(ElectronicHash, this.id);
    updateData();
  }
}
