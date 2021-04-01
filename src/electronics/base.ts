import { ElectronicKind, Connect } from './constant';
import { Electronics } from './parts';
import { Watcher } from 'src/lib/subject';

import type { Line } from './line';
import type { Part } from './part';

/** 全部导线 */
export const lines = new Watcher<Line[]>([]);
/** 全部器件 */
export const parts = new Watcher<Part[]>([]);
/** 被选中的器件 */
export const selects = new Watcher<string[]>([]);
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

function createId(id: string): string {
  const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;

  let index = 1;

  while (ElectronicHash[`${pre[1]}_${index}`]) {
    index++;
  }

  return `${pre[1]}_${index}`;
}

export class Electronic {
  /** 元件编号 */
  readonly id: string;
  /** 元件类型 */
  readonly kind: ElectronicKind;
  /** 元件的连接表 */
  connects: Connect[] = [];

  constructor(kind: ElectronicKind) {
    this.kind = kind;
    this.id = createId(Electronics[kind].pre);
    ElectronicHash[this.id] = this;
    this.dispatch();
  }

  /** 刷新页面 */
  dispatch() {
    lines.setData(getElectronics(true) as Line[]);
    parts.setData(getElectronics(false) as Part[]);
  }

  delete() {
    Reflect.deleteProperty(ElectronicHash, this.id);
    this.dispatch();
  }

  /** 搜索导线 */
  findLine(id: string) {
    return lines.data.find((line) => line.id === id);
  }

  /** 搜索器件 */
  findPart(id: string) {
    return parts.data.find((part) => part.id === id);
  }

  /** 设置选中的器件 */
  setSelects(parts: string[]) {
    selects.setData(parts.filter((id) => ElectronicHash[id]));
  }
}
