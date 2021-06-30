import { ElectronicKind, Context } from './types';
import { Electronics } from './part';
import { Connection, ConnectionData } from './utils/connection';
import { isNumber, remove } from '@xiao-ai/utils';
import { MarkMap } from '@circuit/map';

import type { Part } from './part';
import type { Line } from './line';

/** 全局记号图纸 */
const globalMap = new MarkMap();
/** 全局所有导线 */
const lines: Line[] = [];
/** 全局所有器件 */
const parts: Part[] = [];

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any)._lines = lines;
  (window as any)._parts = parts;
}

export interface ElectronicOption {
  id?: string;
  kind: ElectronicKind | keyof typeof ElectronicKind;
}

export abstract class Electronic {
  /** 元件编号 */
  id: string;

  /** 元件类型 */
  readonly kind: ElectronicKind;
  /** 图纸数据 */
  readonly map = globalMap;
  /** 元件的连接表 */
  readonly connections: Connection[] = [];
  /** 导线储存 */
  private readonly _lines = lines;
  /** 器件储存 */
  private readonly _parts = parts;

  /** 排序下标 */
  sortIndex?: number;

  constructor(opt: ElectronicKind | ElectronicOption, context?: Context) {
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

    // 设置当前环境变量
    if (context) {
      this.map = context.map;
      this._lines = context.lines;
      this._parts = context.parts;
    }

    if (options.id) {
      this.id = options.id;
    }
    else if (options.kind === ElectronicKind.Line) {
      this.id = this.createId('line');
    }
    else {
      this.id = this.createId(Electronics[options.kind].pre);
    }

    if (this.kind === ElectronicKind.Line) {
      this._lines.push(this as any);
      this.connections = [new Connection(), new Connection()];
    }
    else {
      this._parts.push(this as any);
      this.connections = Array(Electronics[this.kind].points.length)
        .fill(0)
        .map(() => new Connection());
    }
  }

  /** 创建编号 */
  private createId(id: string): string {
    const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;
    const all = ([] as Electronic[]).concat(this._lines, this._parts);

    let index = 1;

    while (all.find((item) => item.id === `${pre[1]}_${index}`)) {
      index++;
    }

    return `${pre[1]}_${index}`;
  }

  // 下列属性均为空声明
  /** 更新视图 */
  updateView() { void 0 }
  /** 更新节点 */
  protected updatePoints() { void 0 }
  /** 删除标记 */
  deleteMark() { void 0 }

  /** 删除自己 */
  delete() {
    this.deleteMark();

    for (let i = 0; i < this.connections.length; i++) {
      this.setDeepConnection(i);
    }

    this.kind === ElectronicKind.Line
      ? remove(lines, (({ id }) => id === this.id))
      : remove(parts, (({ id }) => id === this.id));
  }

  /** 设置连接点 */
  setConnection(index: number, data?: ConnectionData | ConnectionData[]) {
    const connection = this.connections[index];

    if (!connection) {
      throw new Error(`引脚下标错误：${index}`);
    }

    connection.set(data)
    this.updatePoints();
  }

  /**
   * 设置连接点
   *  - 所连接元件的连接数据也会变更
   */
  setDeepConnection(index: number, data?: ConnectionData | ConnectionData[]) {
    // 取消旧元件连接
    for (const { id, mark } of this.connections[index].toData()) {
      const el = this.find(id);

      if (el) {
        el.connections[mark].delete(this.id, index);
        el.updatePoints();
      }
    }

    // 设置当前元件连接
    this.setConnection(index, data);

    // 设置新元件连接
    for (const { id, mark } of this.connections[index].toData()) {
      const el = this.find(id);

      if (el) {
        el.connections[mark].add(this.id, index);
        el.updatePoints();
      }
    }
  }

  /** 是否存在连接 */
  hasConnection(id: string, mark: number) {
    return this.connections.some((item) => item.has(id, mark));
  }

  /** 搜索元件 */
  find<E extends Electronic = Electronic>(id: string): E | undefined {
    return this._parts.concat(this._lines as any[]).find((item) => item.id === id) as E | undefined;
  }

  /** 设置选中的器件 */
  setSelects(parts: string[]) {
    // selects.setData(parts.filter((id) => ElectronicHash[id]));
  }
}
