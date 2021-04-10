import { ElectronicKind, Connect } from './constant';
import { Electronics } from './parts';
import { Watcher } from 'src/lib/subject';
import { SignMap } from 'src/lib/map';
import { isNumber } from '@utils/assert';

import type { Line } from './line';
import type { Part } from './part';

/** 全局图纸 */
const map = new SignMap();
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

/** 更新图纸 */
export function dispatch() {
  lines.setData(getElectronics(true) as Line[]);
  parts.setData(getElectronics(false) as Part[]);
}

interface ElectronicOption {
  kind: ElectronicKind | keyof typeof ElectronicKind;
  id?: string;
  connects?: (Connect | undefined)[];
}

export class Electronic {
  /** 元件编号 */
  private _id: string;
  /** 元件类型 */
  readonly kind: ElectronicKind;
  /** 图纸数据 */
  readonly map = map;
  /** 元件的连接表 */
  connects: (Connect | undefined)[];

  constructor(opt: ElectronicKind | ElectronicOption) {
    const options = isNumber(opt)
      ? {
        kind: opt,
      }
      : {
        ...opt,
        kind: isNumber(opt.kind)
          ? opt.kind
          : ElectronicKind[opt.kind],
      };

    this.kind = options.kind;
    this.connects = options.connects ?? [];

    if (options.id) {
      this._id = options.id;
    }
    else if (options.kind === ElectronicKind.Line) {
      this._id = createId('line');
    }
    else {
      this._id = createId(Electronics[options.kind].pre);
    }

    ElectronicHash[this.id] = this;
  }

  /** 元件编号 */
  get id() {
    return this._id;
  }

  /** 刷新所有组件 */
  dispatch() {
    dispatch();
    return this;
  }

  /** 删除自己 */
  delete() {
    Reflect.deleteProperty(ElectronicHash, this.id);
    this.dispatch();
    return this;
  }
  
  /** 移动到最底层 */
  toBottom() {
    // ..
  }

  /** 变更器件编号 */
  setId(newId: string) {
    const old = this.id;

    this._id = newId;

    delete ElectronicHash[old];
    ElectronicHash[this.id] = this;
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
