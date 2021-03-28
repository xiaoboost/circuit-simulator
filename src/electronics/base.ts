import { ElectronicKind, Connect } from './types';
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
    .filter((item) => (
      isLine
        ? item?.kind === ElectronicKind.Line
        : item?.kind !== ElectronicKind.Line
    ));
}

export class Electronic {
  /** 元件编号 */
  readonly id = _id++;
  /** 元件类型 */
  readonly kind: ElectronicKind;
  /** 元件的连接表 */
  connects: Connect[] = [];

  constructor(kind: ElectronicKind) {
    this.kind = kind;
    ElectronicHash[this.id] = this;
    this.update();
  }

  update() {
    lines.setData(getElectronics(true) as Line[]);
    parts.setData(getElectronics(false) as Part[]);
  }

  delete() {
    Reflect.deleteProperty(ElectronicHash, this.id);
    this.update();
  }
}
