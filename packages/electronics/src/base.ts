import { ElectronicKind, Context } from './types';
import { Electronics } from './part/prototype';
import { Connection, ConnectionData } from './utils/connection';
import { isNumber, remove, concat } from '@xiao-ai/utils';
import { MarkMap } from '@circuit/map';

import type { Part } from './part/part';
import type { Line } from './line/line';

/** 全局记号图纸 */
const globalMap = new MarkMap();
/** 全局所有导线 */
const lines: Line[] = [];
/** 全局所有器件 */
const parts: Part[] = [];

if (process.env.NODE_ENV === 'development' && typeof globalThis !== 'undefined') {
  (globalThis as any)._lines = lines;
  (globalThis as any)._parts = parts;
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
  readonly #lines = lines;
  /** 器件储存 */
  readonly #parts = parts;

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
    if (process.env.NODE_ENV === 'test' && context) {
      this.map = context.map;
      this.#lines = context.lines ?? [];
      this.#parts = context.parts ?? [];
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
      this.#lines.push(this as any);
      this.connections = [new Connection(), new Connection()];
    }
    else {
      this.#parts.push(this as any);
      this.connections = Array(Electronics[this.kind].points.length)
        .fill(0)
        .map(() => new Connection());
    }
  }

  /** 创建编号 */
  private createId(id: string): string {
    const pre = id.match(/^([^_]+)(_[^_]+)?$/)!;
    const all = ([] as Electronic[]).concat(this.#lines, this.#parts);

    let index = 1;

    while (all.find((item) => item.id === `${pre[1]}_${index}`)) {
      index++;
    }

    return `${pre[1]}_${index}`;
  }

  /** 拿起元件 */
  deleteMark() {
    throw new Error('方法未实现');
  }
  /** 放下元件 */
  setMark() {
    throw new Error('方法未实现');
  }

  isLine(): this is Line {
    return this.kind === ElectronicKind.Line;
  }

  /** 删除自己 */
  delete() {
    this.deleteMark();

    for (let i = 0; i < this.connections.length; i++) {
      this.deleteConnection(i, true);
    }

    this.kind === ElectronicKind.Line
      ? remove(lines, (({ id }) => id === this.id))
      : remove(parts, (({ id }) => id === this.id));
  }

  /** 设置连接 */
  setConnection(index: number, data: ConnectionData | ConnectionData[], deep = false) {
    const connection = this.connections[index];

    if (!connection) {
      throw new Error(`引脚下标错误：${index}`);
    }

    if (Array.isArray(data)) {
      connection.push(...data)
    }
    else {
      connection.push(data);
    }

    // TODO: deep = true
    // // 取消旧元件连接
    // for (const { id, mark } of this.connections[index].toData()) {
    //   const el = this.find(id);

    //   if (el) {
    //     el.connections[mark].delete(this.id, index);
    //     el.updatePoints();
    //   }
    // }

    // // 设置当前元件连接
    // this.setConnection(index, data);

    // // 设置新元件连接
    // for (const { id, mark } of this.connections[index].toData()) {
    //   const el = this.find(id);

    //   if (el) {
    //     el.connections[mark].add(this.id, index);
    //     el.updatePoints();
    //   }
    // }
  }

  /** 移除所有连接 */
  deleteConnection(index: number, deep?: boolean): void;
  /** 移除指定连接 */
  deleteConnection(index: number, data?: ConnectionData | ConnectionData[], deep?: boolean): void;
  deleteConnection(index: number, data?: ConnectionData | ConnectionData[] | boolean, deep = false) {
    const connection = this.connections[index];

    if (!connection) {
      throw new Error(`引脚下标错误：${index}`);
    }

    const useDeep = typeof data === 'boolean' ? data : deep;
    const arr = typeof data !== 'boolean'
      ? data
        ? Array.isArray(data)
          ? data
          : [data]
        : connection
      : connection;

    connection.delete(...arr);

    if (useDeep) {
    // TODO: deep = true
    }
  }

  /** 是否存在连接 */
  hasConnection(id: string, mark: number) {
    // return this.connections.some((item) => item.has(id, mark));
  }

  /** 获取所有连接 */
  getAllConnection(): ConnectionData[] {
    return concat(this.connections, (val) => Array.from(val));
  }

  /** 变更编号 */
  changeId(newId: string) {
    if (newId === this.id) {
      return;
    }

    this.deleteMark();

    const oldId = this.id;

    this.id = newId;

    // for (let i = 0; i < this.connections.length; i++) {
    //   for (const { id, mark } of this.connections[i]) {
    //     const connectEl = this.find(id);

    //     if (!connectEl) {
    //       this.connections[i].delete(id, mark);
    //       continue;
    //     }

    //     connectEl.connections[mark].delete(oldId, i);
    //     connectEl.connections[mark].add(this.id, i);
    //   }
    // }

    this.setMark();
  }

  /** 搜索元件 */
  find<E extends Electronic = Electronic>(id: string): E | undefined {
    return this.#parts.concat(this.#lines as any[]).find((item) => item.id === id) as E | undefined;
  }

  /** 设置选中的器件 */
  setSelects(parts: string[]) {
    // selects.setData(parts.filter((id) => ElectronicHash[id]));
  }
}
