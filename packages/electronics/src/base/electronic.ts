import { ElectronicKind } from '../types';
import { Electronics } from '../part/prototype';
import { Connection, ConnectionData } from './connection';
import { isNumber, remove, concat } from '@xiao-ai/utils';
import { SheetContext } from './sheet';

import type { Part } from '../part/part';
import type { Line } from '../line/line';

export interface ElectronicOption {
  id?: string;
  kind: ElectronicKind | keyof typeof ElectronicKind;
}

export abstract class Electronic {
  /** 元件编号 */
  id: string;

  /** 元件类型 */
  readonly kind: ElectronicKind;
  /** 元件的连接表 */
  readonly connections: Connection[] = [];
  /** 图纸数据 */
  protected sheet: SheetContext;

  constructor(opt: ElectronicKind | ElectronicOption, sheet?: SheetContext) {
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
    this.sheet = sheet ?? new SheetContext();
    this.sheet.add(this);

    if (options.id) {
      this.id = options.id;
    }
    else if (options.kind === ElectronicKind.Line) {
      this.id = this.sheet.createId('line');
    }
    else {
      this.id = this.sheet.createId(Electronics[options.kind].pre);
    }

    if (this.kind === ElectronicKind.Line) {
      this.connections = [new Connection(), new Connection()];
    }
    else {
      this.connections = Array(Electronics[this.kind].points.length)
        .fill(0)
        .map(() => new Connection());
    }
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
    this.sheet.delete(this);

    for (let i = 0; i < this.connections.length; i++) {
      this.deleteConnection(i, true);
    }
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
}
